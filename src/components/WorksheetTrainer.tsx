import React, { useState, useEffect } from 'react';
import type { Lesson } from '../data/lessons';

interface WorksheetTrainerProps {
  lesson: Lesson;
  onBack: () => void;
}

export const WorksheetTrainer: React.FC<WorksheetTrainerProps> = ({ lesson, onBack }) => {
  const items = lesson.worksheet || [];
  
  // Split items: Part 1 for Romaji -> Kana, Part 2 for Kana -> Romaji
  const midIndex = Math.ceil(items.length / 2);
  const part1Items = items.slice(0, midIndex);
  const part2Items = items.slice(midIndex);

  // States to store user inputs
  const [part1Answers, setPart1Answers] = useState<Record<number, string>>({});
  const [part2Answers, setPart2Answers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  useEffect(() => {
    // Reset state when lesson changes
    setPart1Answers({});
    setPart2Answers({});
    setIsSubmitted(false);
    setScore(0);
    setActiveInputIndex(null);
  }, [lesson]);

  const handlePart1Change = (index: number, val: string) => {
    if (isSubmitted) return;
    setPart1Answers(prev => ({ ...prev, [index]: val }));
  };

  const handlePart2Change = (index: number, val: string) => {
    if (isSubmitted) return;
    setPart2Answers(prev => ({ ...prev, [index]: val }));
  };

  const checkAnswers = () => {
    let correctCount = 0;
    
    // Check Part 1 (Romaji -> Kana)
    part1Items.forEach((item, index) => {
      const userAns = (part1Answers[index] || '').trim().toLowerCase();
      const correctAns = item.kana.trim().toLowerCase();
      if (userAns === correctAns) {
        correctCount++;
      }
    });

    // Check Part 2 (Kana -> Romaji)
    part2Items.forEach((item, index) => {
      const userAns = (part2Answers[index] || '').trim().toLowerCase();
      const correctAns = item.romaji.trim().toLowerCase();
      if (userAns === correctAns) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);

    // Play feedback sound
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const passed = correctCount >= items.length * 0.8;
        if (passed) {
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
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const resetWorksheet = () => {
    setPart1Answers({});
    setPart2Answers({});
    setIsSubmitted(false);
    setScore(0);
  };

  if (items.length === 0) {
    return (
      <div className="lecture-container glass" style={{ padding: '32px', textAlign: 'center' }}>
        <h3>Bài tập đang được cập nhật!</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '16px 0' }}>
          Bài học này hiện chưa có phiếu học tập. Vui lòng quay lại sau hoặc làm bài Quiz trắc nghiệm.
        </p>
        <button className="btn btn-primary" onClick={onBack}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="lecture-container" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="lecture-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại bài giảng
        </button>
        {isSubmitted && (
          <span style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: score >= items.length * 0.8 ? 'var(--success)' : 'var(--warning)',
            background: 'var(--primary-light)',
            padding: '6px 16px',
            borderRadius: '20px'
          }}>
            Kết quả: {score} / {items.length} đúng ({Math.round((score / items.length) * 100)}%)
          </span>
        )}
      </div>

      <div className="page-title" style={{ marginBottom: '24px' }}>
        <h2>Phiếu Bài Tập Thực Hành: {lesson.title.split(":")[1]}</h2>
        <p>Luyện tập dịch chữ cái, từ vựng và tự kiểm tra câu trả lời của bạn.</p>
      </div>

      <div className="lecture-card glass" style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', flexWrap: 'wrap' }}>
          
          {/* Part 1: Romaji -> Kana */}
          <div>
            <h3 className="modal-section-title" style={{ marginBottom: '16px' }}>
              Phần A: Chuyển sang ひらがな / Katakana
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--card-border)', textAlign: 'left' }}>
                  <th style={{ padding: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>STT</th>
                  <th style={{ padding: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Romaji</th>
                  <th style={{ padding: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Đáp án của bạn</th>
                </tr>
              </thead>
              <tbody>
                {part1Items.map((item, index) => {
                  const userVal = part1Answers[index] || '';
                  const isCorrect = userVal.trim().toLowerCase() === item.kana.trim().toLowerCase();
                  let inputStyle = {};
                  if (isSubmitted) {
                    inputStyle = isCorrect 
                      ? { borderColor: 'var(--success)', background: 'rgba(74, 214, 109, 0.05)' }
                      : { borderColor: 'var(--error)', background: 'rgba(255, 74, 90, 0.05)' };
                  }

                  return (
                    <tr key={index} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '10px 8px', fontSize: '14px', fontWeight: 500 }}>{index + 1}</td>
                      <td style={{ padding: '10px 8px', fontSize: '16px', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {item.romaji}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="text"
                            value={userVal}
                            onFocus={() => setActiveInputIndex(index)}
                            onChange={(e) => handlePart1Change(index, e.target.value)}
                            disabled={isSubmitted}
                            placeholder="Nhập chữ..."
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--text-muted)',
                              background: 'rgba(255,255,255,0.03)',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-ja)',
                              fontSize: '16px',
                              outline: 'none',
                              transition: 'all 0.2s',
                              ...inputStyle
                            }}
                          />
                          {isSubmitted && (
                            <span style={{ fontSize: '18px', color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                              {isCorrect ? '✓' : '✗'}
                            </span>
                          )}
                        </div>
                        {isSubmitted && !isCorrect && (
                          <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>
                            Đúng: {item.kana}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Virtual Kana Keyboard */}
            {activeInputIndex !== null && !isSubmitted && (
              <div 
                className="virtual-keyboard glass" 
                style={{ 
                  marginTop: '20px', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--primary-light)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: 'center',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '100%', textAlign: 'center', marginBottom: '4px', fontWeight: 600 }}>
                  ⌨️ Bàn phím ảo động (Lesson {lesson.id}):
                </span>
                {Array.from(new Set(lesson.characters.map(c => c.japanese))).map(char => (
                  <button
                    key={char}
                    type="button"
                    className="btn btn-secondary"
                    style={{ 
                      padding: '8px 14px', 
                      fontSize: '18px', 
                      fontFamily: 'var(--font-ja)', 
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      const currentVal = part1Answers[activeInputIndex] || '';
                      handlePart1Change(activeInputIndex, currentVal + char);
                    }}
                  >
                    {char}
                  </button>
                ))}
                {/* Backspace button */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ 
                    padding: '8px 12px', 
                    fontSize: '13px', 
                    fontWeight: 600,
                    color: 'var(--error)',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    const currentVal = part1Answers[activeInputIndex] || '';
                    if (currentVal.length > 0) {
                      handlePart1Change(activeInputIndex, currentVal.slice(0, -1));
                    }
                  }}
                >
                  ⌫ Xóa
                </button>
              </div>
            )}
          </div>

          {/* Part 2: Kana -> Romaji */}
          <div>
            <h3 className="modal-section-title" style={{ marginBottom: '16px' }}>
              Phần B: Chuyển sang Romaji
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--card-border)', textAlign: 'left' }}>
                  <th style={{ padding: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>STT</th>
                  <th style={{ padding: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Chữ Nhật</th>
                  <th style={{ padding: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Đáp án của bạn</th>
                </tr>
              </thead>
              <tbody>
                {part2Items.map((item, index) => {
                  const userVal = part2Answers[index] || '';
                  const isCorrect = userVal.trim().toLowerCase() === item.romaji.trim().toLowerCase();
                  let inputStyle = {};
                  if (isSubmitted) {
                    inputStyle = isCorrect 
                      ? { borderColor: 'var(--success)', background: 'rgba(74, 214, 109, 0.05)' }
                      : { borderColor: 'var(--error)', background: 'rgba(255, 74, 90, 0.05)' };
                  }

                  return (
                    <tr key={index} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '10px 8px', fontSize: '14px', fontWeight: 500 }}>{index + 1}</td>
                      <td style={{ padding: '10px 8px', fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--font-ja)', color: 'var(--secondary)' }}>
                        {item.kana}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="text"
                            value={userVal}
                            onChange={(e) => handlePart2Change(index, e.target.value)}
                            disabled={isSubmitted}
                            placeholder="Nhập romaji..."
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--text-muted)',
                              background: 'rgba(255,255,255,0.03)',
                              color: 'var(--text-primary)',
                              fontSize: '16px',
                              outline: 'none',
                              transition: 'all 0.2s',
                              ...inputStyle
                            }}
                          />
                          {isSubmitted && (
                            <span style={{ fontSize: '18px', color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                              {isCorrect ? '✓' : '✗'}
                            </span>
                          )}
                        </div>
                        {isSubmitted && !isCorrect && (
                          <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>
                            Đúng: {item.romaji}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px', borderTop: '1px solid var(--card-border)', paddingTop: '20px' }}>
          {!isSubmitted ? (
            <button className="btn btn-primary" onClick={checkAnswers} style={{ padding: '12px 32px' }}>
              Nộp bài kiểm tra 💾
            </button>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={resetWorksheet}>
                Làm lại bài này 🔄
              </button>
              <button className="btn btn-primary" onClick={onBack}>
                Quay lại bài học 📚
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
