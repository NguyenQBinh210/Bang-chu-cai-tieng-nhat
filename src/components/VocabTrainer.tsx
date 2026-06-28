import React, { useState, useEffect } from 'react';
import vocabDataRaw from '../data/vocab.json';
import { fullAlphabetList } from '../data/alphabet';
import { speakJapanese } from '../utils/speech';

export interface VocabItem {
  id: number | string;
  type: 'hiragana' | 'katakana';
  row: 'a' | 'ka' | 'sa' | 'ta' | 'na' | 'ha' | 'ma' | 'ya' | 'ra' | 'wa' | 'special';
  japanese: string;
  romaji: string;
  meaning: string;
  category?: 'basic' | 'dakuon' | 'yoon';
}

const vocabData = vocabDataRaw as VocabItem[];

// Map AlphabetCharacter to VocabItem format for unified treatment
const alphabetData: VocabItem[] = fullAlphabetList.map((char, idx) => ({
  id: `char-${idx}`,
  type: char.type,
  row: char.row,
  japanese: char.japanese,
  romaji: char.romaji,
  meaning: `Chữ cái ${char.type === 'hiragana' ? 'Hiragana' : 'Katakana'} /${char.romaji}/ (${
    char.category === 'basic' ? 'Cơ bản' : char.category === 'dakuon' ? 'Âm đục' : 'Âm ghép'
  })`,
  category: char.category
}));

interface QuizQuestion {
  vocab: VocabItem;
  options: string[];
  correctAnswer: string;
  questionText: string;
}

export const VocabTrainer: React.FC = () => {
  const [studyMode, setStudyMode] = useState<'alphabet' | 'vocabulary'>('alphabet');
  const [filterType, setFilterType] = useState<'all' | 'hiragana' | 'katakana'>('all');
  
  // Row filter for vocabulary, Category filter for alphabet
  const [filterRow, setFilterRow] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'basic' | 'dakuon' | 'yoon'>('all');

  const [learnMode, setLearnMode] = useState<'flashcard' | 'quiz'>('flashcard');
  const [filteredList, setFilteredList] = useState<VocabItem[]>([]);
  
  // Flashcard states
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string | number>>(new Set());

  // Quiz states
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Play sound effects
  const playSound = (type: 'correct' | 'incorrect') => {
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
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(220.00, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(146.83, ctx.currentTime + 0.1); // D3
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Run filters whenever dependencies change
  useEffect(() => {
    let list = studyMode === 'alphabet' ? [...alphabetData] : [...vocabData];
    
    if (filterType !== 'all') {
      list = list.filter(item => item.type === filterType);
    }
    
    if (studyMode === 'alphabet') {
      if (filterCategory !== 'all') {
        list = list.filter(item => item.category === filterCategory);
      }
    } else {
      if (filterRow !== 'all') {
        list = list.filter(item => item.row === filterRow);
      }
    }
    
    // Shuffle the filtered list for a fresh experience
    list.sort(() => Math.random() - 0.5);
    
    setFilteredList(list);
    setCardIndex(0);
    setIsFlipped(false);
    setQuizFinished(false);
    setQuizQuestions([]);
  }, [studyMode, filterType, filterRow, filterCategory]);

  // Generate Quiz Questions
  const startQuiz = () => {
    if (filteredList.length < 4) {
      alert("Danh sách hiện tại quá ít (cần tối thiểu 4 mục) để tạo trắc nghiệm. Vui lòng chọn phạm vi lọc rộng hơn!");
      return;
    }

    // Take up to 10 items
    const selectedVocab = [...filteredList]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    const questions: QuizQuestion[] = selectedVocab.map(vocab => {
      let options: string[] = [];
      let correctAnswer = '';
      let questionText = '';

      if (studyMode === 'alphabet') {
        // Quiz Alphabet: Ask for Romaji
        questionText = `Chữ cái "${vocab.japanese}" phát âm Romaji tương ứng là gì?`;
        correctAnswer = vocab.romaji;
        
        // Find other incorrect Romaji choices from the alphabetData
        const incorrectChoices = alphabetData
          .filter(item => item.romaji !== vocab.romaji)
          .map(item => item.romaji);
        
        const shuffledIncorrect = [...new Set(incorrectChoices)]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        options = [vocab.romaji, ...shuffledIncorrect].sort(() => Math.random() - 0.5);
      } else {
        // Quiz Vocabulary: Ask for meaning
        questionText = `Từ "${vocab.japanese}" (${vocab.romaji}) nghĩa tiếng Việt là gì?`;
        correctAnswer = vocab.meaning;
        
        // Find other incorrect meanings from the vocabData
        const incorrectChoices = vocabData
          .filter(item => item.meaning !== vocab.meaning)
          .map(item => item.meaning);
        
        const shuffledIncorrect = [...new Set(incorrectChoices)]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        options = [vocab.meaning, ...shuffledIncorrect].sort(() => Math.random() - 0.5);
      }

      return {
        vocab,
        options,
        correctAnswer,
        questionText
      };
    });

    setQuizQuestions(questions);
    setCurrentQuizIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setLearnMode('quiz');
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    const isCorrect = option === quizQuestions[currentQuizIdx].correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
      playSound('correct');
    } else {
      playSound('incorrect');
    }

    setTimeout(() => {
      if (currentQuizIdx < quizQuestions.length - 1) {
        setCurrentQuizIdx(currentQuizIdx + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setQuizFinished(true);
      }
    }, isCorrect ? 1000 : 2000);
  };

  const handleFlashcardClick = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && filteredList[cardIndex]) {
      speakJapanese(filteredList[cardIndex].japanese);
    }
  };

  const handleNextCard = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (cardIndex < filteredList.length - 1) {
      setCardIndex(cardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
      setIsFlipped(false);
    }
  };

  const markKnown = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const newKnown = new Set(knownIds);
    newKnown.add(id);
    setKnownIds(newKnown);
    handleNextCard();
  };

  const activeCard = filteredList[cardIndex];

  return (
    <div className="lecture-container" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="page-title" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h2>📝 Học Tập Phản Xạ & Nhận Diện</h2>
        <p>Luyện tập ôn bảng chữ cái đầy đủ và 200 từ vựng tiếng Nhật với Flashcard 3D và Trắc nghiệm phản xạ.</p>
      </div>

      {/* Mode Switches: Alphabet or Vocabulary */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
        <button
          className={`btn ${studyMode === 'alphabet' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '10px 24px', borderRadius: '30px', fontWeight: 600, fontSize: '15px' }}
          onClick={() => {
            setStudyMode('alphabet');
            setFilterType('all');
          }}
        >
          🔤 Học Bảng Chữ Cái Đầy Đủ
        </button>
        <button
          className={`btn ${studyMode === 'vocabulary' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '10px 24px', borderRadius: '30px', fontWeight: 600, fontSize: '15px' }}
          onClick={() => {
            setStudyMode('vocabulary');
            setFilterType('all');
          }}
        >
          📚 Ôn Tập 200 Từ Vựng Bài Tập
        </button>
      </div>

      {/* Filters and Control Board */}
      <div className="glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Deck filter options */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Bộ chữ:</span>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as any)}
                style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', outline: 'none' }}
              >
                <option value="all" style={{ background: 'var(--background)' }}>Tất cả</option>
                <option value="hiragana" style={{ background: 'var(--background)' }}>Hiragana</option>
                <option value="katakana" style={{ background: 'var(--background)' }}>Katakana</option>
              </select>
            </div>

            {studyMode === 'alphabet' ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Phân loại:</span>
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', outline: 'none' }}
                >
                  <option value="all" style={{ background: 'var(--background)' }}>Tất cả các chữ</option>
                  <option value="basic" style={{ background: 'var(--background)' }}>Chữ cơ bản (Gojūon)</option>
                  <option value="dakuon" style={{ background: 'var(--background)' }}>Âm đục (Dakuon/Han-dakuon)</option>
                  <option value="yoon" style={{ background: 'var(--background)' }}>Âm ghép (Yōon)</option>
                </select>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Theo hàng:</span>
                <select 
                  value={filterRow} 
                  onChange={(e) => setFilterRow(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', outline: 'none' }}
                >
                  <option value="all" style={{ background: 'var(--background)' }}>Tất cả</option>
                  <option value="a" style={{ background: 'var(--background)' }}>Hàng A</option>
                  <option value="ka" style={{ background: 'var(--background)' }}>Hàng Ka</option>
                  <option value="sa" style={{ background: 'var(--background)' }}>Hàng Sa</option>
                  <option value="ta" style={{ background: 'var(--background)' }}>Hàng Ta</option>
                  <option value="na" style={{ background: 'var(--background)' }}>Hàng Na</option>
                  <option value="ha" style={{ background: 'var(--background)' }}>Hàng Ha</option>
                  <option value="ma" style={{ background: 'var(--background)' }}>Hàng Ma</option>
                  <option value="ya" style={{ background: 'var(--background)' }}>Hàng Ya</option>
                  <option value="ra" style={{ background: 'var(--background)' }}>Hàng Ra</option>
                  <option value="wa" style={{ background: 'var(--background)' }}>Hàng Wa</option>
                </select>
              </div>
            )}
          </div>

          {/* Mode Switch buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn ${learnMode === 'flashcard' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '8px' }}
              onClick={() => setLearnMode('flashcard')}
            >
              Thẻ ghi nhớ 📚
            </button>
            <button 
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '8px', border: '1px dashed var(--primary)', color: 'var(--primary)' }}
              onClick={startQuiz}
            >
              Trắc nghiệm phản xạ ⚡
            </button>
          </div>

        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid var(--card-border)', paddingTop: '8px' }}>
          🔎 Số lượng đang lọc: <strong>{filteredList.length} mục</strong>. Đã thuộc: <strong>{knownIds.size} mục</strong>.
        </div>
      </div>

      {/* Main Study Arena */}
      {learnMode === 'flashcard' ? (
        filteredList.length > 0 ? (
          <div className="flashcard-section">
            <div 
              className={`flashcard-wrapper ${isFlipped ? 'flipped' : ''}`}
              onClick={handleFlashcardClick}
            >
              <div className="flashcard-inner">
                {/* Front card body */}
                <div className="flashcard-face flashcard-front">
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', position: 'absolute', top: '16px' }}>
                    {studyMode === 'alphabet' ? 'NHÌN CHỮ CÁI' : 'NHÌN TỪ VỰNG'} (Nhấp để lật nghĩa)
                  </span>
                  <div className="flashcard-jp" style={{ fontSize: activeCard.japanese.length > 5 ? '40px' : '72px' }}>
                    {activeCard.japanese}
                  </div>
                  <button 
                    className="modal-speak-badge" 
                    style={{ marginTop: '20px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      speakJapanese(activeCard.japanese);
                    }}
                  >
                    🔊 Nghe phát âm
                  </button>
                </div>

                {/* Back card body */}
                <div className="flashcard-face flashcard-back">
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', position: 'absolute', top: '16px' }}>
                    PHÁT ÂM & Ý NGHĨA
                  </span>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
                    /{activeCard.romaji}/
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 500, margin: '12px 0', textAlign: 'center', background: 'rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: '12px' }}>
                    {activeCard.meaning}
                  </div>
                  <div style={{ fontSize: '13px', opacity: 0.8, textTransform: 'capitalize' }}>
                    Bộ: {activeCard.type === 'hiragana' ? 'Chữ mềm Hiragana' : 'Chữ cứng Katakana'} 
                    {activeCard.category && ` (${activeCard.category === 'basic' ? 'Cơ bản' : activeCard.category === 'dakuon' ? 'Âm đục' : 'Âm ghép'})`}
                  </div>

                  <button 
                    className="btn btn-secondary"
                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginTop: '16px', padding: '6px 12px', borderRadius: '8px' }}
                    onClick={(e) => markKnown(e, activeCard.id)}
                  >
                    Đã thuộc ✓
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flashcard-controls" style={{ justifyContent: 'space-between' }}>
              <button 
                className="btn btn-secondary" 
                onClick={handlePrevCard}
                disabled={cardIndex === 0}
                style={{ opacity: cardIndex === 0 ? 0.5 : 1, cursor: cardIndex === 0 ? 'not-allowed' : 'pointer' }}
              >
                Trước
              </button>

              <span style={{ fontWeight: 600, fontSize: '14px', alignSelf: 'center' }}>
                Mục {cardIndex + 1} / {filteredList.length}
              </span>

              <button 
                className="btn btn-primary" 
                onClick={handleNextCard}
                disabled={cardIndex === filteredList.length - 1}
                style={{ opacity: cardIndex === filteredList.length - 1 ? 0.5 : 1, cursor: cardIndex === filteredList.length - 1 ? 'not-allowed' : 'pointer' }}
              >
                Tiếp theo
              </button>
            </div>
          </div>
        ) : (
          <div className="lecture-card glass" style={{ textAlign: 'center', padding: '32px' }}>
            <h3>Không tìm thấy mục học nào!</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Vui lòng điều chỉnh lại bộ lọc bảng chữ hoặc hàng chữ cái thích hợp.
            </p>
          </div>
        )
      ) : (
        // Quiz Arena
        !quizFinished && quizQuestions.length > 0 ? (
          <div className="quiz-container">
            <div className="quiz-header">
              <span className="quiz-progress">
                Tiến trình: Câu {currentQuizIdx + 1} / {quizQuestions.length}
              </span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                Số câu đúng: {score}
              </span>
            </div>

            <div className="progress-bar-bg" style={{ marginBottom: '24px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((currentQuizIdx) / quizQuestions.length) * 100}%`, background: 'var(--primary)' }}
              ></div>
            </div>

            <div className="quiz-card glass">
              <h3 className="quiz-question" style={{ fontSize: '22px', fontWeight: 700 }}>
                {quizQuestions[currentQuizIdx].questionText}
              </h3>
              
              <div className="quiz-display">
                <div 
                  className="quiz-display-char" 
                  style={{ width: 'auto', padding: '0 32px', fontSize: studyMode === 'alphabet' ? '72px' : '48px', cursor: 'pointer' }}
                  onClick={() => speakJapanese(quizQuestions[currentQuizIdx].vocab.japanese)}
                  title="Nhấp để nghe lại phát âm"
                >
                  {quizQuestions[currentQuizIdx].vocab.japanese} 🔊
                </div>
              </div>

              {/* Options lists */}
              <div className="quiz-options">
                {quizQuestions[currentQuizIdx].options.map((option, idx) => {
                  let btnClass = '';
                  if (isAnswered) {
                    if (option === quizQuestions[currentQuizIdx].correctAnswer) {
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
                      style={{ fontSize: '16px', padding: '14px' }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Quiz Scorecard report
          <div className="quiz-container glass" style={{ padding: '40px' }}>
            <div className="quiz-result">
              <div className="result-emoji">
                {score >= quizQuestions.length * 0.8 ? '🎉' : '💪'}
              </div>
              <h2 className="result-score">Hoàn thành: {Math.round((score / quizQuestions.length) * 100)}%</h2>
              <p className="result-comment" style={{ fontSize: '18px', fontWeight: 500 }}>
                Bạn đạt số điểm đúng {score} / {quizQuestions.length}. <br />
                {score >= quizQuestions.length * 0.8 
                  ? 'Kỹ năng phản xạ của bạn thật tuyệt vời!' 
                  : 'Hãy ôn luyện kỹ hơn với Flashcard trước khi thực hành lại nhé!'}
              </p>
              <div className="result-actions">
                <button className="btn btn-secondary" onClick={startQuiz}>
                  Làm lại Quiz 🔄
                </button>
                <button className="btn btn-primary" onClick={() => setLearnMode('flashcard')}>
                  Học Flashcards 📚
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
