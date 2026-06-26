import React, { useState } from 'react';
import type { Lesson, Character } from '../data/lessons';
import { speakJapanese } from '../utils/speech';
import { CanvasTrainer } from './CanvasTrainer';

interface LectureSlideProps {
  lesson: Lesson;
  onBack: () => void;
  onStartQuiz: () => void;
  onStartWorksheet: () => void;
}

export const LectureSlide: React.FC<LectureSlideProps> = ({ lesson, onBack, onStartQuiz, onStartWorksheet }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnMode, setLearnMode] = useState<'slide' | 'flashcard'>('slide');

  const char: Character = lesson.characters[currentIndex];

  const handleNext = () => {
    if (currentIndex < lesson.characters.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      speakJapanese(lesson.characters[currentIndex + 1].japanese);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      speakJapanese(lesson.characters[currentIndex - 1].japanese);
    }
  };

  const playCharSound = () => {
    speakJapanese(char.japanese);
  };

  const playWordSound = (word: string) => {
    speakJapanese(word);
  };

  return (
    <div className="lecture-container">
      <div className="lecture-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại danh sách
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${learnMode === 'slide' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '8px' }}
            onClick={() => setLearnMode('slide')}
          >
            Chế độ học Slide
          </button>
          <button 
            className={`btn ${learnMode === 'flashcard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '8px' }}
            onClick={() => setLearnMode('flashcard')}
          >
            Chế độ Flashcard
          </button>
          {lesson.worksheet && lesson.worksheet.length > 0 && (
            <button 
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '8px', border: '1px dashed var(--primary)', color: 'var(--primary)' }}
              onClick={onStartWorksheet}
            >
              Phiếu bài tập 📝
            </button>
          )}
        </div>
      </div>

      <div className="page-title" style={{ marginBottom: '24px' }}>
        <h2>{lesson.title}</h2>
        <p>Bước {currentIndex + 1} / {lesson.characters.length}: Học chữ cái và ví dụ</p>
      </div>

      {learnMode === 'slide' ? (
        // Detailed Slide View
        <div className="lecture-card glass" style={{ animation: 'fadeIn 0.4s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div 
                className="modal-jp-large" 
                style={{ fontSize: '120px', cursor: 'pointer' }}
                onClick={playCharSound}
                title="Nhấp để nghe phát âm"
              >
                {char.japanese}
              </div>
              <div style={{ textAlign: 'center' }}>
                <span className="modal-romaji-large" style={{ fontSize: '36px' }}>/ {char.romaji} /</span>
                <div style={{ marginTop: '8px' }}>
                  <button className="modal-speak-badge" onClick={playCharSound}>
                    Nghe đọc 🔊
                  </button>
                </div>
              </div>

              <div style={{ width: '100%', marginTop: '16px' }}>
                <h4 className="modal-section-title">Hình ảnh gợi nhớ</h4>
                <div className="mnemonic-box">
                  💡 {char.mnemonic}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 className="modal-section-title">Luyện viết nét</h4>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CanvasTrainer character={char.japanese} />
                </div>
              </div>

              <div>
                <h4 className="modal-section-title">Từ vựng đi kèm</h4>
                <div className="examples-grid" style={{ gridTemplateColumns: '1fr' }}>
                  {char.examples.map((ex, idx) => (
                    <div 
                      key={idx} 
                      className="example-card glass"
                      onClick={() => playWordSound(ex.word)}
                    >
                      <div className="example-left">
                        <span className="example-word">{ex.word}</span>
                        <span className="example-romaji">{ex.romaji}</span>
                        <span className="example-meaning">{ex.meaning}</span>
                      </div>
                      <div className="example-right">🔊</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Interactive Flashcard View
        <div className="flashcard-section" style={{ animation: 'fadeIn 0.4s ease' }}>
          <div 
            className={`flashcard-wrapper ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flashcard-inner">
              {/* Front Side: Japanese letter */}
              <div className="flashcard-face flashcard-front">
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', position: 'absolute', top: '16px' }}>
                  MẶT TRƯỚC (Nhấp để lật)
                </span>
                <div className="flashcard-jp">{char.japanese}</div>
                <button 
                  className="modal-speak-badge" 
                  style={{ marginTop: '20px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    playCharSound();
                  }}
                >
                  🔊 Nghe âm
                </button>
              </div>

              {/* Back Side: Romaji, Meaning, Mnemonic */}
              <div className="flashcard-face flashcard-back">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', position: 'absolute', top: '16px' }}>
                  MẶT SAU (Nhấp để lật lại)
                </span>
                <div style={{ fontSize: '48px', fontWeight: 700 }}>{char.romaji}</div>
                
                <div style={{ margin: '20px 0', fontSize: '14px', lineHeight: '1.5', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
                  <strong>Gợi nhớ:</strong> {char.mnemonic}
                </div>

                <div style={{ textAlign: 'left', width: '100%' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>
                    Ví dụ tiêu biểu:
                  </div>
                  {char.examples.map((ex, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                      <span>{ex.word} ({ex.romaji})</span>
                      <span>{ex.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            💡 Mẹo: Nhấp vào thẻ để lật mặt xem đáp án và gợi nhớ chữ cái!
          </p>
        </div>
      )}

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.5 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
        >
          Trước
        </button>

        {currentIndex === lesson.characters.length - 1 ? (
          <div style={{ display: 'flex', gap: '12px' }}>
            {lesson.worksheet && lesson.worksheet.length > 0 && (
              <button className="btn btn-secondary" onClick={onStartWorksheet} style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                Phiếu bài tập 📝
              </button>
            )}
            <button className="btn btn-primary" onClick={onStartQuiz}>
              Trắc nghiệm (Quiz) ⚡
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={handleNext}>
            Tiếp theo
          </button>
        )}
      </div>
    </div>
  );
};
