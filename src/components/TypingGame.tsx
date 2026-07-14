import React, { useState, useEffect, useRef } from 'react';
import typingDataRaw from '../data/typing_game.json';
import { speakJapanese } from '../utils/speech';

interface TypingItem {
  id: number;
  alphabet: string;
  row: string;
  question: string;
  correct_answer: string;
  hint: string;
}

const typingData = typingDataRaw as TypingItem[];

export const TypingGame: React.FC = () => {
  const [filterAlphabet, setFilterAlphabet] = useState<'all' | 'hiragana' | 'katakana'>('all');
  const [selectedRows, setSelectedRows] = useState<string[]>(['all']);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  
  // Game session states
  const [filteredList, setFilteredList] = useState<TypingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Time metrics
  const [timeLimit, setTimeLimit] = useState(60); // default is 60s
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // sound effects
  const playSound = (type: 'correct' | 'incorrect' | 'win') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'incorrect') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        // win sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.5);
        osc2.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Run filter
  useEffect(() => {
    let list = [...typingData];
    if (filterAlphabet !== 'all') {
      list = list.filter(item => item.alphabet === filterAlphabet);
    }
    if (!selectedRows.includes('all') && selectedRows.length > 0) {
      list = list.filter(item => selectedRows.includes(item.row));
    }
    
    // Shuffle
    list.sort(() => Math.random() - 0.5);
    setFilteredList(list);
  }, [filterAlphabet, selectedRows]);

  const handleToggleRow = (rowId: string) => {
    if (rowId === 'all') {
      setSelectedRows(['all']);
    } else {
      let next = selectedRows.filter(r => r !== 'all');
      if (next.includes(rowId)) {
        next = next.filter(r => r !== rowId);
      } else {
        next.push(rowId);
      }
      if (next.length === 0) {
        next = ['all'];
      }
      setSelectedRows(next);
    }
  };

  const startGame = () => {
    if (filteredList.length === 0) {
      alert("Bộ lọc hiện tại không có từ vựng nào. Vui lòng chọn lại!");
      return;
    }
    
    setCurrentIndex(0);
    setUserAnswer('');
    setScore(0);
    setShowHint(false);
    setIsError(false);
    setSuccessCount(0);
    setWrongCount(0);
    setTimeLeft(timeLimit > 0 ? timeLimit : 0);
    setGameStarted(true);
    setGameFinished(false);

    // Focus input on next tick
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeLimit > 0) {
      // Countdown mode
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            finishGame();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      // Count-up stopwatch mode for unlimited time
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t + 1);
      }, 1000);
    }
  };

  const finishGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameFinished(true);
    playSound('win');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gameStarted || gameFinished) return;

    const currentItem = filteredList[currentIndex];
    const cleanAnswer = userAnswer.trim().toLowerCase();
    const isCorrect = cleanAnswer === currentItem.correct_answer;

    if (isCorrect) {
      playSound('correct');
      setScore(s => s + 10);
      setSuccessCount(s => s + 1);
      setIsError(false);
      setShowHint(false);
      setUserAnswer('');

      if (currentIndex < filteredList.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        if (timeLimit > 0) {
          const reshuffled = [...filteredList].sort(() => Math.random() - 0.5);
          setFilteredList(reshuffled);
          setCurrentIndex(0);
        } else {
          finishGame();
        }
      }
    } else {
      playSound('incorrect');
      setIsError(true);
      setWrongCount(w => w + 1);
      setTimeout(() => setIsError(false), 500); // Reset shake animation
    }
  };

  const handleSkip = () => {
    setShowHint(false);
    setIsError(false);
    setUserAnswer('');
    if (currentIndex < filteredList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (timeLimit > 0) {
        const reshuffled = [...filteredList].sort(() => Math.random() - 0.5);
        setFilteredList(reshuffled);
        setCurrentIndex(0);
      } else {
        finishGame();
      }
    }
  };

  // Automatically pronounce the new word when the question changes
  useEffect(() => {
    if (gameStarted && !gameFinished && filteredList[currentIndex]) {
      const activeWord = filteredList[currentIndex].question;
      const timer = setTimeout(() => {
        speakJapanese(activeWord);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, gameStarted, gameFinished]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const activeItem = filteredList[currentIndex];

  return (
    <div className="quiz-container" style={{ maxWidth: '650px', animation: 'fadeIn 0.4s ease' }}>
      <div className="page-title" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h2>⌨️ Trò Chơi Gõ Chữ Tính Điểm</h2>
        <p>Luyện kỹ năng nhớ mặt chữ và viết phiên âm Romaji nhanh dưới áp lực thời gian!</p>
      </div>

      {!gameStarted ? (
        // Setup screen
        <div className="quiz-card glass" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>⚙️ Thiết lập phòng chơi</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Bộ chữ:</span>
              <select 
                value={filterAlphabet} 
                onChange={(e) => setFilterAlphabet(e.target.value as any)}
                style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', width: '200px' }}
              >
                <option value="all" style={{ background: 'var(--background)' }}>Tất cả</option>
                <option value="hiragana" style={{ background: 'var(--background)' }}>Hiragana</option>
                <option value="katakana" style={{ background: 'var(--background)' }}>Katakana</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontWeight: 600 }}>Theo hàng chữ cái (Chọn kết hợp nhiều hàng):</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleToggleRow('all')}
                  className={`btn ${selectedRows.includes('all') ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ 
                    padding: '6px 14px', 
                    fontSize: '12px', 
                    borderRadius: '20px', 
                    border: '1px solid var(--card-border)',
                    boxShadow: selectedRows.includes('all') ? '0 0 10px rgba(255, 117, 143, 0.3)' : 'none' 
                  }}
                >
                  Tất cả các hàng
                </button>
                {[
                  { id: 'a', label: 'Hàng A' },
                  { id: 'ka', label: 'Hàng Ka' },
                  { id: 'sa', label: 'Hàng Sa' },
                  { id: 'ta', label: 'Hàng Ta' },
                  { id: 'na', label: 'Hàng Na' },
                  { id: 'ha', label: 'Hàng Ha' },
                  { id: 'ma', label: 'Hàng Ma' },
                  { id: 'ya', label: 'Hàng Ya' },
                  { id: 'ra', label: 'Hàng Ra' },
                  { id: 'wa', label: 'Hàng Wa' }
                ].map(r => {
                  const isSelected = selectedRows.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleToggleRow(r.id)}
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ 
                        padding: '6px 14px', 
                        fontSize: '12px', 
                        borderRadius: '20px',
                        border: '1px solid var(--card-border)',
                        boxShadow: isSelected ? '0 0 10px rgba(255, 117, 143, 0.3)' : 'none' 
                      }}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Thời gian chơi:</span>
              <select 
                value={timeLimit} 
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', width: '200px' }}
              >
                <option value={30} style={{ background: 'var(--background)' }}>30 giây</option>
                <option value={60} style={{ background: 'var(--background)' }}>60 giây (Mặc định)</option>
                <option value={90} style={{ background: 'var(--background)' }}>90 giây</option>
                <option value={120} style={{ background: 'var(--background)' }}>120 giây</option>
                <option value={180} style={{ background: 'var(--background)' }}>180 giây (3 phút)</option>
                <option value={300} style={{ background: 'var(--background)' }}>300 giây (5 phút)</option>
                <option value={0} style={{ background: 'var(--background)' }}>Không giới hạn</option>
              </select>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255, 117, 143, 0.05)', border: '1px solid var(--card-border)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              🔎 Số từ vựng khả dụng trong bộ lọc: <strong>{filteredList.length} từ</strong>. <br />
              ⏱️ Thời gian thiết lập: <strong>{timeLimit > 0 ? `${timeLimit} giây` : 'Không giới hạn (đếm tiến)'}</strong>.
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 'bold' }}
            onClick={startGame}
          >
            Bắt đầu chơi 🎮
          </button>
        </div>
      ) : !gameFinished ? (
        // Active gameplay screen
        <div>
          <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderRadius: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: 600 }}>
              <span>🎯 Điểm số: <span style={{ color: 'var(--primary)' }}>{score}</span></span>
              <span>🔥 Câu số: <span>{currentIndex + 1} / {filteredList.length}</span></span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: timeLimit > 0 && timeLeft <= 15 ? 'var(--error)' : 'var(--success)', animation: timeLimit > 0 && timeLeft <= 15 ? 'pulse 1s infinite' : 'none' }}>
              ⏱️ Thời gian: {timeLeft}s {timeLimit === 0 && '(Vô hạn)'}
            </div>
          </div>

          <div className={`quiz-card glass ${isError ? 'shake' : ''}`} style={{ padding: '32px', textAlign: 'center' }}>
            
            <div style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div 
                style={{ fontSize: '64px', fontWeight: 'bold', fontFamily: 'var(--font-ja)', color: 'var(--text-primary)', cursor: 'pointer' }}
                onClick={() => speakJapanese(activeItem.question)}
                title="Nhấp để nghe phát âm"
              >
                {activeItem.question}
              </div>
            </div>

            <button 
              className="modal-speak-badge" 
              style={{ marginBottom: '24px' }}
              onClick={() => speakJapanese(activeItem.question)}
            >
              🔊 Nghe âm đọc
            </button>

            {/* Input field */}
            <form onSubmit={handleSubmit} style={{ margin: '12px 0 24px 0' }}>
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  if (isError) setIsError(false);
                }}
                placeholder="Nhập phiên âm Romaji (Ví dụ: sushi)..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: isError ? '2px solid var(--error)' : '2px solid var(--card-border)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-primary)',
                  fontSize: '18px',
                  textAlign: 'center',
                  outline: 'none',
                  boxShadow: isError ? '0 0 12px rgba(255, 74, 90, 0.2)' : 'none',
                  transition: 'border 0.2s'
                }}
              />
            </form>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={() => setShowHint(!showHint)}
              >
                💡 {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý nghĩa'}
              </button>

              <button 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '13px', background: 'rgba(0,0,0,0.1)' }}
                onClick={handleSkip}
              >
                Bỏ qua ⏭️
              </button>

              <button 
                className="btn btn-primary"
                style={{ padding: '8px 24px', fontSize: '13px' }}
                onClick={() => handleSubmit()}
              >
                Kiểm tra ↵
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div 
                style={{
                  marginTop: '20px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'var(--primary-light)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  animation: 'fadeIn 0.3s ease',
                  border: '1px solid var(--card-border)'
                }}
              >
                <strong>Gợi ý nghĩa tiếng Việt:</strong> {activeItem.hint}
              </div>
            )}

          </div>
        </div>
      ) : (
        // Score screen
        <div className="quiz-card glass" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🏆</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
            Hết Giờ! Kết Quả Chơi
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Thời gian 60 giây đã kết thúc. Hãy xem thành tích gõ chữ của bạn!
          </p>

          <div className="dashboard-grid" style={{ marginBottom: '32px', gap: '16px' }}>
            <div className="stat-card glass" style={{ padding: '16px' }}>
              <div style={{ fontSize: '24px' }}>🎯</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)' }}>{score}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tổng điểm số</div>
            </div>

            <div className="stat-card glass" style={{ padding: '16px' }}>
              <div style={{ fontSize: '24px' }}>✅</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--success)' }}>{successCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Số từ gõ đúng</div>
            </div>

            <div className="stat-card glass" style={{ padding: '16px' }}>
              <div style={{ fontSize: '24px' }}>❌</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--error)' }}>{wrongCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Số từ gõ sai</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setGameStarted(false)}>
              Quay lại Setup ⚙️
            </button>
            <button className="btn btn-primary" onClick={startGame}>
              Chơi Lại Vòng Mới 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
