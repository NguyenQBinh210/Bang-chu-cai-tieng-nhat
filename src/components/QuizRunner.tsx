import React, { useState, useEffect } from 'react';
import type { Lesson, QuizQuestion } from '../data/lessons';
import { speakJapanese } from '../utils/speech';
import vocabDataRaw from '../data/vocab.json';

interface QuizRunnerProps {
  lesson: Lesson;
  onFinishQuiz: (scorePercent: number) => void;
  onBack: () => void;
}

// Dynamic Quiz Generator for 50 questions
const generate50Questions = (lesson: Lesson): QuizQuestion[] => {
  const generated: QuizQuestion[] = [];
  const chars = lesson.characters;
  
  // Prepare vocabulary list with Vietnamese meanings from vocab.json lookup
  const vocabList = (lesson.worksheet || []).map(w => {
    const meaning = vocabDataRaw.find((v: any) => v.japanese === w.kana)?.meaning || "Từ vựng trong bài";
    return {
      romaji: w.romaji,
      kana: w.kana,
      meaning: meaning
    };
  });

  // Fallback to examples if worksheet vocabulary is empty
  if (vocabList.length === 0) {
    chars.forEach(c => {
      c.examples.forEach(ex => {
        vocabList.push({
          romaji: ex.romaji,
          kana: ex.word,
          meaning: ex.meaning
        });
      });
    });
  }

  let qId = 1;
  const addQuestion = (q: Partial<QuizQuestion>) => {
    generated.push({
      id: `gen_${lesson.id}_${qId++}`,
      type: q.type || 'select-romaji',
      question: q.question || '',
      options: q.options || [],
      correctAnswer: q.correctAnswer || '',
      audioText: q.audioText,
      pairs: q.pairs
    });
  };

  // Helper to get random incorrect options from list
  const getIncorrectOptions = (correctVal: string, allPossible: string[], count = 3): string[] => {
    const filtered = allPossible.filter(val => val !== correctVal);
    const unique = [...new Set(filtered)];
    return unique.sort(() => Math.random() - 0.5).slice(0, count);
  };

  // 1. Basic Character Questions (Romaji <-> Japanese)
  chars.forEach(c => {
    // Romaji -> Japanese letter
    const incorrectKanas = getIncorrectOptions(c.japanese, chars.map(item => item.japanese));
    const options1 = [c.japanese, ...incorrectKanas].sort(() => Math.random() - 0.5);
    addQuestion({
      type: 'select-character',
      question: `Chữ cái nào sau đây phát âm Romaji tương ứng là '${c.romaji}'?`,
      options: options1,
      correctAnswer: c.japanese
    });

    // Japanese letter -> Romaji
    const incorrectRomajis = getIncorrectOptions(c.romaji, chars.map(item => item.romaji));
    const options2 = [c.romaji, ...incorrectRomajis].sort(() => Math.random() - 0.5);
    addQuestion({
      type: 'select-romaji',
      question: `Chữ cái '${c.japanese}' phát âm Romaji là gì?`,
      options: options2,
      correctAnswer: c.romaji
    });
  });

  // 2. Vocabulary Questions (Meaning, Romaji, Japanese)
  vocabList.forEach(v => {
    // Japanese -> Vietnamese Meaning
    const incorrectMeanings = getIncorrectOptions(v.meaning, vocabDataRaw.map((item: any) => item.meaning));
    const options1 = [v.meaning, ...incorrectMeanings].sort(() => Math.random() - 0.5);
    addQuestion({
      type: 'select-romaji',
      question: `Từ '${v.kana}' (${v.romaji}) nghĩa tiếng Việt là gì?`,
      options: options1,
      correctAnswer: v.meaning
    });

    // Vietnamese Meaning -> Japanese
    const incorrectKanas = getIncorrectOptions(v.kana, vocabList.map(item => item.kana));
    const options2 = [v.kana, ...incorrectKanas].sort(() => Math.random() - 0.5);
    addQuestion({
      type: 'select-character',
      question: `Từ nào sau đây viết bằng chữ Nhật có nghĩa là '${v.meaning}'?`,
      options: options2,
      correctAnswer: v.kana
    });

    // Romaji -> Japanese
    const incorrectKanas2 = getIncorrectOptions(v.kana, vocabList.map(item => item.kana));
    const options3 = [v.kana, ...incorrectKanas2].sort(() => Math.random() - 0.5);
    addQuestion({
      type: 'select-character',
      question: `Từ '${v.romaji}' viết bằng chữ Hiragana/Katakana tương ứng là gì?`,
      options: options3,
      correctAnswer: v.kana
    });
  });

  // 3. Character Combination & Spelling Questions (Ghép chữ thành từ)
  const multiCharWords = vocabList.filter(v => v.kana.length >= 2);
  multiCharWords.forEach(v => {
    // "Ghép 'A' + 'B' = từ gì?"
    const charSpelling = v.kana.split('').map(char => `'${char}'`).join(' + ');
    const incorrectCombinations = getIncorrectOptions(
      `${v.kana} (${v.meaning})`,
      vocabList.filter(item => item.kana !== v.kana).map(item => `${item.kana} (${item.meaning})`)
    );
    const options1 = [`${v.kana} (${v.meaning})`, ...incorrectCombinations].sort(() => Math.random() - 0.5);
    addQuestion({
      type: 'select-romaji',
      question: `Ghép các ký tự sau: ${charSpelling} sẽ tạo thành từ nào có nghĩa?`,
      options: options1,
      correctAnswer: `${v.kana} (${v.meaning})`
    });

    // "Chọn ký tự khuyết: 'A' + [?] = 'AB'"
    if (v.kana.length === 2) {
      const char1 = v.kana[0];
      const char2 = v.kana[1];
      const incorrectMissing = getIncorrectOptions(char2, chars.map(item => item.japanese));
      const options2 = [char2, ...incorrectMissing].sort(() => Math.random() - 0.5);
      addQuestion({
        type: 'select-character',
        question: `Chọn ký tự còn thiếu vào chỗ trống [ ? ] để tạo thành từ '${v.kana}' (${v.meaning}): '${char1}' + [ ? ]`,
        options: options2,
        correctAnswer: char2
      });
    }
  });

  // 4. Fill or truncate to exactly 50 questions
  let finalQuestions = [...generated];
  if (finalQuestions.length > 50) {
    finalQuestions = finalQuestions.sort(() => Math.random() - 0.5).slice(0, 50);
  } else if (finalQuestions.length < 50) {
    while (finalQuestions.length < 50) {
      const randomQ = generated[Math.floor(Math.random() * generated.length)];
      finalQuestions.push({
        ...randomQ,
        id: `gen_${lesson.id}_${qId++}`
      });
    }
  }

  // Shuffle to mix up character questions, vocab, and spelling questions
  return finalQuestions.sort(() => Math.random() - 0.5);
};

export const QuizRunner: React.FC<QuizRunnerProps> = ({ lesson, onFinishQuiz, onBack }) => {
  const [quizMode, setQuizMode] = useState<'select' | 'run'>('select');
  const [activeQuizzes, setActiveQuizzes] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // States for matching pairs question type
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // list of matched left values
  const [shuffledLeft, setShuffledLeft] = useState<string[]>([]);
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);

  const question: QuizQuestion = activeQuizzes[currentQuestionIndex];

  // Sound feedback using Web Audio API
  const playFeedbackSound = (type: 'correct' | 'incorrect') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(220.00, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(146.83, ctx.currentTime + 0.15); // D3
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (err) {
      console.warn("AudioContext sound error", err);
    }
  };

  useEffect(() => {
    if (quizMode !== 'run') return;
    
    // Reset states for a new question
    setSelectedAnswer(null);
    setIsAnswered(false);
    setLeftSelected(null);
    setRightSelected(null);
    setMatchedPairs([]);

    if (question && question.type === 'listen-select' && question.audioText) {
      setTimeout(() => {
        speakJapanese(question.audioText!);
      }, 500);
    }

    if (question && question.type === 'match-pairs' && question.pairs) {
      const lefts = question.pairs.map(p => p.left);
      const rights = question.pairs.map(p => p.right);
      setShuffledLeft([...lefts].sort(() => Math.random() - 0.5));
      setShuffledRight([...rights].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestionIndex, quizMode]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    const correct = option === question.correctAnswer;
    
    if (correct) {
      setScore(s => s + 1);
      playFeedbackSound('correct');
    } else {
      playFeedbackSound('incorrect');
    }

    setTimeout(() => {
      goToNext();
    }, correct ? 1000 : 1800);
  };

  const goToNext = () => {
    if (currentQuestionIndex < activeQuizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
      const percent = Math.round((score / activeQuizzes.length) * 100);
      onFinishQuiz(percent);
    }
  };

  // Logic for Matching Pairs
  const handleMatchSelect = (val: string, side: 'left' | 'right') => {
    if (side === 'left') {
      if (matchedPairs.includes(val)) return;
      setLeftSelected(val);
    } else {
      const leftVal = question.pairs?.find(p => p.right === val)?.left;
      if (leftVal && matchedPairs.includes(leftVal)) return;
      setRightSelected(val);
    }
  };

  useEffect(() => {
    if (leftSelected && rightSelected && question.pairs) {
      const correctPair = question.pairs.find(
        p => p.left === leftSelected && p.right === rightSelected
      );

      if (correctPair) {
        playFeedbackSound('correct');
        setMatchedPairs(prev => [...prev, leftSelected]);
        setLeftSelected(null);
        setRightSelected(null);
      } else {
        playFeedbackSound('incorrect');
        const leftEl = document.querySelector(`[data-val="${leftSelected}"]`);
        const rightEl = document.querySelector(`[data-val="${rightSelected}"]`);
        if (leftEl) leftEl.classList.add('incorrect');
        if (rightEl) rightEl.classList.add('incorrect');
        
        setTimeout(() => {
          if (leftEl) leftEl.classList.remove('incorrect');
          if (rightEl) rightEl.classList.remove('incorrect');
          setLeftSelected(null);
          setRightSelected(null);
        }, 800);
      }
    }
  }, [leftSelected, rightSelected]);

  useEffect(() => {
    if (question && question.type === 'match-pairs' && question.pairs) {
      if (matchedPairs.length === question.pairs.length && question.pairs.length > 0) {
        setScore(s => s + 1);
        setTimeout(() => {
          goToNext();
        }, 1200);
      }
    }
  }, [matchedPairs]);

  const handlePlayTTS = () => {
    if (question.audioText) {
      speakJapanese(question.audioText);
    }
  };

  const handleStartBasicQuiz = () => {
    setActiveQuizzes(lesson.quizzes);
    setQuizMode('run');
  };

  const handleStart50Quiz = () => {
    const questions = generate50Questions(lesson);
    setActiveQuizzes(questions);
    setQuizMode('run');
  };

  // 1. Render Setup Selection Screen
  if (quizMode === 'select') {
    return (
      <div className="quiz-container glass" style={{ padding: '32px', textAlign: 'center', maxWidth: '600px', animation: 'fadeIn 0.4s ease' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '12px' }}>⚡ Bắt đầu bài trắc nghiệm</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
          Vui lòng chọn chế độ làm bài kiểm tra cho <strong>{lesson.title}</strong>:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
          {/* Short option */}
          <div 
            className="lesson-card-item glass"
            onClick={handleStartBasicQuiz}
            style={{ 
              cursor: 'pointer', 
              padding: '20px', 
              borderLeft: '5px solid var(--secondary)', 
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <div style={{ fontSize: '32px' }}>📚</div>
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Luyện tập cơ bản (Ngắn)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Làm bài trắc nghiệm cơ bản gồm {lesson.quizzes.length} câu theo bài học.
              </p>
            </div>
          </div>

          {/* 50 questions option */}
          <div 
            className="lesson-card-item glass"
            onClick={handleStart50Quiz}
            style={{ 
              cursor: 'pointer', 
              padding: '20px', 
              borderLeft: '5px solid var(--primary)', 
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <div style={{ fontSize: '32px' }}>🔥</div>
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Đề trắc nghiệm 50 câu (Master Challenge)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Thử thách phản xạ 50 câu: nhận diện mặt chữ Nhật-Việt, ghép 2 chữ cái thành từ có nghĩa.
              </p>
            </div>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={onBack} style={{ width: '100%' }}>
          Quay lại bài giảng
        </button>
      </div>
    );
  }

  // 2. Render Score/Result Screen
  if (isFinished) {
    const finalPercent = Math.round((score / activeQuizzes.length) * 100);
    const isPassed = finalPercent >= 80;

    return (
      <div className="quiz-container glass" style={{ padding: '40px' }}>
        <div className="quiz-result">
          <div className="result-emoji">
            {isPassed ? '🎉' : '💪'}
          </div>
          <h2 className="result-score">Kết quả: {finalPercent}%</h2>
          <p className="result-comment" style={{ fontSize: '18px', fontWeight: 500 }}>
            Đúng {score} / {activeQuizzes.length} câu. <br />
            {isPassed ? 'Tuyệt vời! Bạn đã hoàn thành xuất sắc bài kiểm tra này!' : 'Cố lên! Bạn cần đạt tối thiểu 80% để vượt qua bài này.'}
          </p>
          <div className="result-actions">
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setCurrentQuestionIndex(0);
                setScore(0);
                setIsFinished(false);
                setSelectedAnswer(null);
                setIsAnswered(false);
              }}
            >
              Làm lại 🔄
            </button>
            <button className="btn btn-primary" onClick={onBack}>
              Về Bài giảng 📚
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((currentQuestionIndex / activeQuizzes.length) * 100);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="back-btn" onClick={() => setQuizMode('select')}>
          ← Quay lại Chọn đề
        </button>
        <span className="quiz-progress">
          Câu {currentQuestionIndex + 1} / {activeQuizzes.length}
        </span>
      </div>

      {/* Linear progress bar */}
      <div className="progress-bar-bg" style={{ marginBottom: '24px' }}>
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressPercent}%`, background: 'var(--primary)' }}
        ></div>
      </div>

      <div className="quiz-card glass">
        <h3 className="quiz-question">{question.question}</h3>

        {/* Display depending on question type */}
        {question.type === 'select-romaji' && (
          <div className="quiz-display">
            <div className="quiz-display-char">
              {question.question.split("'")[1] || (question.correctAnswer && question.correctAnswer.length === 1 ? question.correctAnswer : "")}
            </div>
          </div>
        )}

        {question.type === 'select-character' && (
          <div className="quiz-display">
            <div className="quiz-display-char" style={{ fontSize: '40px', color: 'var(--secondary)' }}>
              /{question.question.split("'")[1] || (lesson.characters[0] ? lesson.characters[0].romaji : "")}/
            </div>
          </div>
        )}

        {question.type === 'listen-select' && (
          <div className="quiz-display">
            <button className="quiz-audio-btn" onClick={handlePlayTTS} title="Phát lại âm thanh">
              🔊
            </button>
          </div>
        )}

        {/* Options for Multiple Choice */}
        {question.type !== 'match-pairs' ? (
          <div className="quiz-options">
            {question.options?.map((option, idx) => {
              let btnClass = '';
              if (isAnswered) {
                if (option === question.correctAnswer) {
                  btnClass = 'correct';
                } else if (option === selectedAnswer) {
                  btnClass = 'incorrect';
                }
              }

              return (
                <button
                  key={idx}
                  className={`quiz-option-btn ${btnClass}`}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  style={{ padding: '14px', fontSize: '15px' }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          // Matching Game Interface
          <div className="matching-pairs-grid">
            <div className="matching-column">
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>
                Bảng chữ cái Nhật
              </span>
              {shuffledLeft.map((val) => {
                const isMatched = matchedPairs.includes(val);
                const isSelected = leftSelected === val;
                
                return (
                  <div
                    key={val}
                    data-val={val}
                    className={`match-item japanese ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
                    onClick={() => handleMatchSelect(val, 'left')}
                  >
                    {val}
                  </div>
                );
              })}
            </div>

            <div className="matching-column">
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>
                Cách đọc (Romaji)
              </span>
              {shuffledRight.map((val) => {
                const leftCorresponding = question.pairs?.find(p => p.right === val)?.left;
                const isMatched = leftCorresponding ? matchedPairs.includes(leftCorresponding) : false;
                const isSelected = rightSelected === val;

                return (
                  <div
                    key={val}
                    data-val={val}
                    className={`match-item ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
                    onClick={() => handleMatchSelect(val, 'right')}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
