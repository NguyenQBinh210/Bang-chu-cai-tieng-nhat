import React, { useState, useEffect } from 'react';
import type { Lesson, QuizQuestion } from '../data/lessons';
import { speakJapanese } from '../utils/speech';

interface QuizRunnerProps {
  lesson: Lesson;
  onFinishQuiz: (scorePercent: number) => void;
  onBack: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ lesson, onFinishQuiz, onBack }) => {
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

  const question: QuizQuestion = lesson.quizzes[currentQuestionIndex];

  // Sound effects using Web Audio API synthesis
  const playFeedbackSound = (type: 'correct' | 'incorrect') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.frequency.setValueAtTime(220.00, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(146.83, ctx.currentTime + 0.15); // D3
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (err) {
      console.warn("AudioContext sound error", err);
    }
  };

  useEffect(() => {
    // Reset states for a new question
    setSelectedAnswer(null);
    setIsAnswered(false);
    setLeftSelected(null);
    setRightSelected(null);
    setMatchedPairs([]);

    if (question && question.type === 'listen-select' && question.audioText) {
      // Auto play audio for listening questions
      setTimeout(() => {
        speakJapanese(question.audioText!);
      }, 500);
    }

    if (question && question.type === 'match-pairs' && question.pairs) {
      // Shuffle left and right sides
      const lefts = question.pairs.map(p => p.left);
      const rights = question.pairs.map(p => p.right);
      setShuffledLeft([...lefts].sort(() => Math.random() - 0.5));
      setShuffledRight([...rights].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestionIndex]);

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

    // Auto proceed after short delay
    setTimeout(() => {
      goToNext();
    }, correct ? 1200 : 2000);
  };

  const goToNext = () => {
    if (currentQuestionIndex < lesson.quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
      const percent = Math.round((score / lesson.quizzes.length) * 100);
      onFinishQuiz(percent);
    }
  };

  // Logic for Matching Pairs Game
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

  // Watch for matching pair selection
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
        // Flash red visual error, then reset
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

  // Check if all pairs matched in match-pairs
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

  if (isFinished) {
    const finalPercent = Math.round((score / lesson.quizzes.length) * 100);
    const isPassed = finalPercent >= 80;

    return (
      <div className="quiz-container glass" style={{ padding: '40px' }}>
        <div className="quiz-result">
          <div className="result-emoji">
            {isPassed ? '🎉' : '💪'}
          </div>
          <h2 className="result-score">Kết quả: {finalPercent}%</h2>
          <p className="result-comment" style={{ fontSize: '18px', fontWeight: 500 }}>
            Đúng {score} / {lesson.quizzes.length} câu. <br />
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

  const progressPercent = Math.round((currentQuestionIndex / lesson.quizzes.length) * 100);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="back-btn" onClick={onBack}>
          ← Thoát Quiz
        </button>
        <span className="quiz-progress">
          Câu {currentQuestionIndex + 1} / {lesson.quizzes.length}
        </span>
      </div>

      {/* Linear progress bar for the quiz */}
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
            <div className="quiz-display-char">{question.question.split("'")[1] || lesson.characters[0].japanese}</div>
          </div>
        )}

        {question.type === 'select-character' && (
          <div className="quiz-display">
            <div className="quiz-display-char" style={{ fontSize: '40px', color: 'var(--secondary)' }}>
              /{question.question.split("'")[1] || lesson.characters[0].romaji}/
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
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          // Matching Game Interface
          <div className="matching-pairs-grid">
            {/* Left Column (Japanese Letters) */}
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

            {/* Right Column (Romaji) */}
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
