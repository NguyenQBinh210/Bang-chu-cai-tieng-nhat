import React, { useState, useEffect, useRef } from 'react';
import { hiraganaAlphabet, katakanaAlphabet } from '../data/alphabet';
import { speakJapanese } from '../utils/speech';

interface CellData {
  consonant: string;
  vowel: string;
  romaji: string;
  correctJapanese: string;
  isEmptySlot: boolean; // true if it is an empty space in the Gojūon table (like yi, ye)
}

const CONSONANTS = ['-', 'K', 'S', 'T', 'N', 'H', 'M', 'Y', 'R', 'W'];
const VOWELS = ['A', 'I', 'U', 'E', 'O'];

const getRomaji = (consonant: string, vowel: string): string => {
  if (consonant === '-') return vowel.toLowerCase();
  
  const c = consonant.toLowerCase();
  const v = vowel.toLowerCase();
  
  // Special phonetic romaji mapping
  if (c === 's' && v === 'i') return 'shi';
  if (c === 't' && v === 'i') return 'chi';
  if (c === 't' && v === 'u') return 'tsu';
  if (c === 'h' && v === 'u') return 'fu';
  
  // Obsolete/missing cells
  if (c === 'y' && (v === 'i' || v === 'e')) return '';
  if (c === 'w' && (v === 'i' || v === 'u' || v === 'e')) {
    if (v === 'i') return 'n'; // Place 'n' at W-I
    return '';
  }
  
  return c + v;
};

export const GridMatchGame: React.FC = () => {
  const [alphabetType, setAlphabetType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [difficulty, setDifficulty] = useState<number>(10); // number of blanks: 10, 20, 30, 46
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // Grid cells data
  const [gridData, setGridData] = useState<CellData[][]>([]);
  // Blanks coordinates: Set of "consonant-vowel"
  const [blankCells, setBlankCells] = useState<string[]>([]);
  // Placed letters: Map of "consonant-vowel" -> japanese letter
  const [placedLetters, setPlacedLetters] = useState<Record<string, string>>({});
  // Pool of letters to place
  const [letterPool, setLetterPool] = useState<string[]>([]);
  const [selectedPoolLetter, setSelectedPoolLetter] = useState<string | null>(null);
  
  // Stats
  const [score, setScore] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [wrongCellKey, setWrongCellKey] = useState<string | null>(null); // For shake effect
  const [correctCellKey, setCorrectCellKey] = useState<string | null>(null); // For green feedback
  
  // Timer
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'incorrect') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
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
        osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const getCharSymbol = (romaji: string): string => {
    if (!romaji) return '';
    const alphabet = alphabetType === 'hiragana' ? hiraganaAlphabet : katakanaAlphabet;
    const found = alphabet.find(c => c.romaji === romaji && c.category === 'basic');
    return found ? found.japanese : '';
  };

  const initGame = () => {
    // 1. Build Grid Matrix
    const matrix: CellData[][] = [];
    const playableCellsList: { key: string; japanese: string }[] = [];

    for (let rIndex = 0; rIndex < VOWELS.length; rIndex++) {
      const rowCells: CellData[] = [];
      const v = VOWELS[rIndex];
      for (let cIndex = 0; cIndex < CONSONANTS.length; cIndex++) {
        const c = CONSONANTS[cIndex];
        const romaji = getRomaji(c, v);
        const japanese = getCharSymbol(romaji);
        const isEmptySlot = romaji === '';

        rowCells.push({
          consonant: c,
          vowel: v,
          romaji,
          correctJapanese: japanese,
          isEmptySlot
        });

        if (!isEmptySlot && japanese) {
          playableCellsList.push({
            key: `${c}-${v}`,
            japanese
          });
        }
      }
      matrix.push(rowCells);
    }

    setGridData(matrix);

    // 2. Sample blank cells based on difficulty
    const targetBlanksCount = Math.min(difficulty, playableCellsList.length);
    // Shuffle the list of playable cells to pick random blanks
    const shuffledPlayable = [...playableCellsList].sort(() => Math.random() - 0.5);
    const chosenBlanks = shuffledPlayable.slice(0, targetBlanksCount);
    
    const blankKeys = chosenBlanks.map(item => item.key);
    const blankJapaneseLetters = chosenBlanks.map(item => item.japanese);

    setBlankCells(blankKeys);
    setPlacedLetters({});
    // Shuffle the letters in the pool
    setLetterPool([...blankJapaneseLetters].sort(() => Math.random() - 0.5));
    setSelectedPoolLetter(null);
    setScore(0);
    setWrongAttempts(0);
    setWrongCellKey(null);
    setCorrectCellKey(null);
    setTimeSpent(0);
    setGameStarted(true);
    setGameFinished(false);

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeSpent(t => t + 1);
    }, 1000);
  };

  const handleCellClick = (cell: CellData) => {
    if (!gameStarted || gameFinished) return;
    const key = `${cell.consonant}-${cell.vowel}`;

    // Only interact if it's a blank cell and hasn't been solved/placed yet
    if (!blankCells.includes(key) || placedLetters[key]) {
      // If it's already filled, speak the character
      if (cell.correctJapanese) {
        speakJapanese(cell.correctJapanese);
      }
      return;
    }

    if (!selectedPoolLetter) {
      return; // No letter selected from pool to match
    }

    // Check matching
    if (selectedPoolLetter === cell.correctJapanese) {
      // Correct Match!
      playSound('correct');
      speakJapanese(cell.correctJapanese);
      
      setPlacedLetters(prev => ({ ...prev, [key]: selectedPoolLetter }));
      setScore(s => s + 10);
      setCorrectCellKey(key);
      setTimeout(() => setCorrectCellKey(null), 600);

      // Remove letter from pool
      const updatedPool = [...letterPool];
      const indexToRemove = updatedPool.indexOf(selectedPoolLetter);
      if (indexToRemove > -1) {
        updatedPool.splice(indexToRemove, 1);
      }
      setLetterPool(updatedPool);
      setSelectedPoolLetter(null);

      // Check win condition
      // If pool is empty, game is won!
      if (updatedPool.length === 0) {
        finishGame();
      }
    } else {
      // Incorrect Match!
      playSound('incorrect');
      setWrongAttempts(w => w + 1);
      setWrongCellKey(key);
      setTimeout(() => setWrongCellKey(null), 500); // clear shake class
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

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="quiz-container" style={{ maxWidth: '850px', animation: 'fadeIn 0.4s ease' }}>
      <div className="page-title" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2>🧩 Trò Chơi Ghép Hàng Cột (Gojūon Grid Matcher)</h2>
        <p>Thử thách ráp các chữ cái Hiragana/Katakana vào đúng vị trí tọa độ Nguyên âm & Phụ âm!</p>
      </div>

      {!gameStarted ? (
        // Setup screen
        <div className="quiz-card glass" style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>⚙️ Chọn cấu hình trò chơi</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Bộ chữ hiển thị:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={`btn ${alphabetType === 'hiragana' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                  onClick={() => setAlphabetType('hiragana')}
                >
                  Hiragana
                </button>
                <button
                  className={`btn ${alphabetType === 'katakana' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                  onClick={() => setAlphabetType('katakana')}
                >
                  Katakana
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Độ khó (Số ô khuyết):</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', width: '180px', outline: 'none' }}
              >
                <option value={5} style={{ background: 'var(--background)' }}>Dễ (5 ô khuyết)</option>
                <option value={10} style={{ background: 'var(--background)' }}>Bình thường (10 ô khuyết)</option>
                <option value={20} style={{ background: 'var(--background)' }}>Khó (20 ô khuyết)</option>
                <option value={35} style={{ background: 'var(--background)' }}>Rất khó (35 ô khuyết)</option>
                <option value={46} style={{ background: 'var(--background)' }}>Thách thức (Hết bảng - 46 ô)</option>
              </select>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255, 117, 143, 0.05)', border: '1px solid var(--card-border)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              🧠 <strong>Cách chơi:</strong> <br />
              1. Chọn bộ chữ và số lượng ô trống bạn muốn thử thách. <br />
              2. Khi bắt đầu, bấm vào một chữ cái trong <strong>kho chữ cái</strong> ở bên dưới. <br />
              3. Bấm vào đúng vị trí tọa độ của chữ đó trên bảng (ví dụ: giao điểm hàng <strong>A</strong> và cột <strong>K</strong> là chữ <strong>か (ka)</strong>).
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 'bold' }}
            onClick={initGame}
          >
            Bắt đầu ghép bảng 🎮
          </button>
        </div>
      ) : !gameFinished ? (
        // Active gameplay
        <div>
          {/* Header Dashboard stats */}
          <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderRadius: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: 600 }}>
              <span>🎯 Điểm số: <span style={{ color: 'var(--primary)' }}>{score}</span></span>
              <span>⚠️ Số lần nhầm: <span style={{ color: 'var(--error)' }}>{wrongAttempts}</span></span>
              <span>🧩 Còn lại: <span>{letterPool.length} ô khuyết</span></span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--success)' }}>
              ⏱️ Thời gian: {formatTime(timeSpent)}
            </div>
          </div>

          {/* Tips bar */}
          <div style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
            {selectedPoolLetter ? (
              <span>👉 Hãy bấm vào ô khuyết thích hợp trên bảng để đặt chữ <strong>{selectedPoolLetter}</strong></span>
            ) : (
              <span>👇 Hãy chọn 1 chữ cái từ kho chữ cái bên dưới để bắt đầu đặt vào bảng</span>
            )}
          </div>

          {/* Gojūon Coordinate Grid Board */}
          <div className="table-game-grid-container" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div className="table-game-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(11, minmax(65px, 1fr))', 
              gap: '6px', 
              minWidth: '780px',
              padding: '6px'
            }}>
              
              {/* Header corner cell */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '45px', border: '1px solid var(--card-border)' }}>
                {alphabetType === 'hiragana' ? 'あ' : 'ア'} \
              </div>

              {/* Consonants Header columns */}
              {CONSONANTS.map(c => (
                <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', height: '45px', border: '1px solid var(--card-border)' }}>
                  <span>{c}</span>
                  <span style={{ fontSize: '10px', opacity: 0.5, textTransform: 'lowercase' }}>{c === '-' ? 'vowel' : c}</span>
                </div>
              ))}

              {/* Rows matching */}
              {gridData.map((rowCells, rIdx) => {
                const vHeader = VOWELS[rIdx];
                return (
                  <React.Fragment key={vHeader}>
                    {/* Row vowel header */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', height: '55px', border: '1px solid var(--card-border)' }}>
                      <span>{vHeader}</span>
                      <span style={{ fontSize: '10px', opacity: 0.5, textTransform: 'lowercase' }}>/{vHeader.toLowerCase()}/</span>
                    </div>

                    {/* Column values */}
                    {rowCells.map((cell) => {
                      const cellKey = `${cell.consonant}-${cell.vowel}`;
                      const isBlank = blankCells.includes(cellKey);
                      const isPlaced = !!placedLetters[cellKey];
                      const isWrong = wrongCellKey === cellKey;
                      const isCorrect = correctCellKey === cellKey;

                      // Styles based on states
                      let displayVal = '';
                      let cellClass = '';
                      let cellStyle: React.CSSProperties = {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        height: '55px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        userSelect: 'none'
                      };

                      if (cell.isEmptySlot) {
                        cellStyle.background = 'transparent';
                        cellStyle.border = 'none';
                        cellStyle.pointerEvents = 'none';
                      } else if (isBlank) {
                        if (isPlaced) {
                          displayVal = placedLetters[cellKey];
                          cellStyle.background = 'rgba(255, 117, 143, 0.15)';
                          cellStyle.border = '1px solid var(--primary)';
                          cellStyle.color = 'var(--primary)';
                          cellStyle.fontWeight = 'bold';
                          cellStyle.fontSize = '20px';
                        } else {
                          displayVal = '?';
                          cellStyle.background = 'rgba(255, 255, 255, 0.02)';
                          cellStyle.border = isWrong 
                            ? '2px solid var(--error)' 
                            : isCorrect 
                            ? '2px solid var(--success)' 
                            : '1px dashed rgba(255, 255, 255, 0.2)';
                          cellStyle.color = isWrong ? 'var(--error)' : 'rgba(255, 255, 255, 0.3)';
                          cellStyle.fontSize = '14px';
                          cellStyle.boxShadow = isWrong ? '0 0 10px rgba(255, 74, 90, 0.4)' : 'none';
                          cellClass = isWrong ? 'shake' : '';
                        }
                      } else {
                        // Standard visible cell
                        displayVal = cell.correctJapanese;
                        cellStyle.background = 'rgba(255,255,255,0.03)';
                        cellStyle.border = '1px solid rgba(255,255,255,0.08)';
                        cellStyle.color = 'var(--text-primary)';
                        cellStyle.fontSize = '20px';
                        cellStyle.fontFamily = 'var(--font-ja)';
                      }

                      return (
                        <div
                          key={cellKey}
                          className={cellClass}
                          style={cellStyle}
                          onClick={() => handleCellClick(cell)}
                        >
                          <span style={{ fontFamily: 'var(--font-ja)' }}>{displayVal}</span>
                          {!cell.isEmptySlot && (
                            <span style={{ fontSize: '9px', opacity: 0.4, textTransform: 'lowercase', marginTop: '2px' }}>
                              {cell.romaji}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}

            </div>
          </div>

          {/* Letter Pool section */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📦 Kho chữ cái khuyết:
              <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
                (Chọn chữ cái bên dưới rồi nhấp vào ô trống tương ứng phía trên)
              </span>
            </h4>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {letterPool.map((letter, idx) => {
                const isSelected = selectedPoolLetter === letter;
                return (
                  <button
                    key={`${letter}-${idx}`}
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      setSelectedPoolLetter(letter);
                      speakJapanese(letter);
                    }}
                    style={{
                      width: '48px',
                      height: '48px',
                      fontSize: '22px',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-ja)',
                      fontWeight: 'bold',
                      border: '1px solid var(--card-border)',
                      boxShadow: isSelected ? '0 0 12px rgba(255, 117, 143, 0.4)' : 'none',
                      transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 0.15s'
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quit button */}
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '24px', padding: '12px' }}
            onClick={() => setGameStarted(false)}
          >
            Dừng chơi & Thoát 🛑
          </button>
        </div>
      ) : (
        // Finish Scoreboard
        <div className="quiz-card glass" style={{ textAlign: 'center', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🏆</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
            Chúc mừng bạn đã hoàn thành!
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
            Bạn đã ghép thành công toàn bộ {difficulty} ô trống chữ {alphabetType === 'hiragana' ? 'Hiragana' : 'Katakana'}!
          </p>

          <div className="dashboard-grid" style={{ marginBottom: '32px', gap: '16px' }}>
            <div className="stat-card glass" style={{ padding: '16px' }}>
              <div style={{ fontSize: '24px' }}>⏱️</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', marginTop: '4px' }}>
                {formatTime(timeSpent)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Thời gian hoàn thành</div>
            </div>

            <div className="stat-card glass" style={{ padding: '16px' }}>
              <div style={{ fontSize: '24px' }}>🎯</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)', marginTop: '4px' }}>
                {score}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tổng điểm số</div>
            </div>

            <div className="stat-card glass" style={{ padding: '16px' }}>
              <div style={{ fontSize: '24px' }}>⚠️</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--error)', marginTop: '4px' }}>
                {wrongAttempts}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Số lần chọn sai</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setGameStarted(false)}>
              Về Setup ⚙️
            </button>
            <button className="btn btn-primary" onClick={initGame}>
              Chơi Lại Vòng Mới 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
