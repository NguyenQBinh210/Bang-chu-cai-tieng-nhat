import React, { useState, useRef } from 'react';
import examDataRaw from '../data/n5_exam.json';

interface ExamQuestion {
  id: string;
  section: 'vocabulary' | 'grammar' | 'reading';
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const examQuestions = examDataRaw as ExamQuestion[];

export const N5Exam: React.FC = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  
  // Test states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  
  // Timer (25 minutes = 1500 seconds)
  const [timeLeft, setTimeLeft] = useState(1500);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Review mode
  const [reviewMode, setReviewMode] = useState(false);

  // Sound effects
  const playSound = (type: 'win' | 'fail' | 'click') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'win') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const startExam = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    setTimeLeft(1500); // 25 mins
    setExamStarted(true);
    setExamFinished(false);
    setReviewMode(false);
    playSound('click');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          submitExam(true); // force submit on time out
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const submitExam = (forced = false) => {
    // Show warning if not all questions are answered
    if (!forced) {
      const answeredCount = Object.keys(userAnswers).length;
      if (answeredCount < examQuestions.length) {
        const confirmSubmit = window.confirm(
          `Bạn mới trả lời ${answeredCount}/${examQuestions.length} câu hỏi. Bạn có chắc chắn muốn nộp bài thi?`
        );
        if (!confirmSubmit) return;
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setExamFinished(true);

    // Play feedback sound based on score
    const finalScore = calculateScore();
    if (finalScore >= 15) {
      playSound('win');
    } else {
      playSound('fail');
    }
  };

  const calculateScore = () => {
    let correct = 0;
    examQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSelectAnswer = (option: string) => {
    if (examFinished) return;
    const activeQ = examQuestions[currentIdx];
    setUserAnswers(prev => ({
      ...prev,
      [activeQ.id]: option
    }));
    playSound('click');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const activeQuestion = examQuestions[currentIdx];

  const getSectionName = (sec: string) => {
    if (sec === 'vocabulary') return 'Phần 1: Chữ Hán & Từ Vựng';
    if (sec === 'grammar') return 'Phần 2: Ngữ Pháp';
    return 'Phần 3: Đọc Hiểu';
  };

  const currentScore = calculateScore();
  const isPassed = currentScore >= 15;

  return (
    <div className="quiz-container" style={{ maxWidth: '850px', animation: 'fadeIn 0.4s ease' }}>
      <div className="page-title" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2>📝 Đề Thi Thử N5 Chuẩn JLPT</h2>
        <p>Đánh giá năng lực tiếng Nhật N5 với cấu trúc đề và áp lực thời gian thực tế!</p>
      </div>

      {!examStarted ? (
        // Instructions Screen
        <div className="quiz-card glass" style={{ padding: '36px', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>📋 Quy chế thi thử</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', fontSize: '14px', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
              <span>⏱️ Thời gian làm bài:</span>
              <strong>25 phút</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
              <span>🎯 Số lượng câu hỏi:</span>
              <strong>25 câu hỏi</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
              <span>✔️ Điều kiện đỗ (Pass):</span>
              <strong style={{ color: 'var(--success)' }}>{"15/25 câu đúng trở lên (>= 60%)"}</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong>Phân bổ đề thi:</strong>
              <ul>
                <li>• <strong>Câu 1 - 10:</strong> Nhận diện chữ Hán & từ vựng (Hiragana ↔ Kanji, chọn từ điền ngữ cảnh).</li>
                <li>• <strong>Câu 11 - 20:</strong> Kiểm tra trợ từ, chia động từ và <strong>Câu hỏi dấu sao (*) sắp xếp câu</strong> chuẩn JLPT.</li>
                <li>• <strong>Câu 21 - 25:</strong> Đọc hiểu các đoạn thư ngắn, email, bảng thông báo và trả lời câu hỏi.</li>
              </ul>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 'bold' }}
            onClick={startExam}
          >
            Bắt đầu làm bài thi ⚡
          </button>
        </div>
      ) : !examFinished ? (
        // Active gameplay screen
        <div>
          {/* Top Panel (Timer & Progress) */}
          <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderRadius: '12px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Đang làm: </span>
              <strong style={{ color: 'var(--secondary)' }}>{getSectionName(activeQuestion.section)}</strong>
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: timeLeft <= 180 ? 'var(--error)' : 'var(--primary)', 
              animation: timeLeft <= 180 ? 'pulse 1s infinite' : 'none' 
            }}>
              ⏱️ Thời gian còn lại: {formatTime(timeLeft)}
            </div>
          </div>

          {/* Quick jump question numbers panel */}
          <div className="glass" style={{ padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--card-border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
              Bản đồ câu hỏi (Nhấp để chuyển nhanh):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {examQuestions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = !!userAnswers[q.id];
                
                let btnBackground = 'rgba(255,255,255,0.03)';
                let btnColor = 'var(--text-primary)';
                let btnBorder = '1px solid var(--card-border)';
                
                if (isCurrent) {
                  btnBackground = 'var(--primary)';
                  btnColor = 'white';
                  btnBorder = '1px solid var(--primary)';
                } else if (isAnswered) {
                  btnBackground = 'rgba(0, 210, 252, 0.15)';
                  btnColor = 'var(--secondary)';
                  btnBorder = '1px solid var(--secondary)';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: btnBackground,
                      color: btnColor,
                      border: btnBorder,
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Card */}
          <div className="quiz-card glass" style={{ padding: '32px', minHeight: '320px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
              <span>Câu hỏi {currentIdx + 1} / {examQuestions.length}</span>
              <span>Dạng bài: {activeQuestion.type.toUpperCase()}</span>
            </div>

            {/* Question Text */}
            <div 
              style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                lineHeight: '1.6', 
                color: 'var(--text-primary)', 
                marginBottom: '24px', 
                whiteSpace: 'pre-line',
                fontFamily: 'var(--font-ja)'
              }}
            >
              {activeQuestion.question}
            </div>

            {/* Options list */}
            <div className="quiz-options">
              {activeQuestion.options.map((option, oIdx) => {
                const isSelected = userAnswers[activeQuestion.id] === option;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectAnswer(option)}
                    className={`quiz-option-btn ${isSelected ? 'correct' : ''}`}
                    style={{ 
                      textAlign: 'left', 
                      padding: '14px 20px', 
                      fontSize: '15px',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--card-border)',
                      background: isSelected ? 'rgba(255, 117, 143, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                      fontFamily: 'var(--font-ja)'
                    }}
                  >
                    <span style={{ marginRight: '12px', fontWeight: 'bold' }}>{oIdx + 1}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation & Submit buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
              }}
              disabled={currentIdx === 0}
              style={{ opacity: currentIdx === 0 ? 0.5 : 1 }}
            >
              ← Câu trước
            </button>

            {currentIdx < examQuestions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentIdx(currentIdx + 1)}
              >
                Câu tiếp theo →
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ background: 'var(--success)', border: 'none', color: 'white', fontWeight: 'bold', padding: '10px 24px' }}
                onClick={() => submitExam()}
              >
                Nộp bài thi 🏁
              </button>
            )}
          </div>
        </div>
      ) : (
        // Results & Review Screen
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Result card */}
          <div className="quiz-card glass" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>
              {isPassed ? '🎉' : '💪'}
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: isPassed ? 'var(--success)' : 'var(--error)', marginBottom: '8px' }}>
              {isPassed ? 'BẠN ĐÃ ĐỖ (PASS)!' : 'CHƯA ĐẠT (FAILED)'}
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
              Điều kiện đạt: 15/25 câu đúng. Kết quả của bạn:
            </p>

            <div className="dashboard-grid" style={{ marginBottom: '32px', gap: '16px' }}>
              <div className="stat-card glass" style={{ padding: '16px' }}>
                <div style={{ fontSize: '24px' }}>🎯</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', marginTop: '4px' }}>
                  {currentScore} / {examQuestions.length}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Câu trả lời đúng</div>
              </div>

              <div className="stat-card glass" style={{ padding: '16px' }}>
                <div style={{ fontSize: '24px' }}>📈</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary)', marginTop: '4px' }}>
                  {Math.round((currentScore / examQuestions.length) * 100)}%
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tỉ lệ chính xác</div>
              </div>

              <div className="stat-card glass" style={{ padding: '16px' }}>
                <div style={{ fontSize: '24px' }}>⏱️</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)', marginTop: '4px' }}>
                  {formatTime(1500 - timeLeft)}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Thời gian làm bài</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setExamStarted(false)}
              >
                Về Setup thi thử ⚙️
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => setReviewMode(true)}
                style={{ background: 'var(--success)', border: 'none' }}
              >
                Xem đáp án & giải thích 🔍
              </button>
            </div>
          </div>

          {/* Detailed explanation review panel */}
          {reviewMode && (
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--card-border)', animation: 'slideUp 0.4s ease' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px' }}>
                🔍 Chi tiết lời giải của bài thi
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {examQuestions.map((q, idx) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div 
                      key={q.id} 
                      style={{ 
                        padding: '20px', 
                        borderRadius: '12px', 
                        background: 'rgba(255,255,255,0.02)', 
                        border: isCorrect ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(248, 113, 113, 0.3)' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>Câu {idx + 1} ({q.section.toUpperCase()})</span>
                        <span style={{ 
                          color: isCorrect ? 'var(--success)' : 'var(--error)', 
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {isCorrect ? '✅ Đúng' : '❌ Sai'}
                        </span>
                      </div>

                      {/* Question Text */}
                      <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px', whiteSpace: 'pre-line', fontFamily: 'var(--font-ja)' }}>
                        {q.question}
                      </p>

                      {/* Answer Comparison */}
                      <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                        <span>• Câu trả lời của bạn: <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--error)', fontFamily: 'var(--font-ja)' }}>{userAnswer || "(Không trả lời)"}</strong></span>
                        <span>• Đáp án đúng: <strong style={{ color: 'var(--success)', fontFamily: 'var(--font-ja)' }}>{q.correctAnswer}</strong></span>
                      </div>

                      {/* Explanation box */}
                      <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', fontSize: '13px', color: 'var(--text-secondary)', borderLeft: '3px solid var(--secondary)' }}>
                        <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
