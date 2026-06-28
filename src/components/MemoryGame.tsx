import React, { useState, useEffect, useRef } from 'react';
import { hiraganaAlphabet, katakanaAlphabet } from '../data/alphabet';
import type { AlphabetCharacter } from '../data/alphabet';

interface Card {
  id: number;
  matchId: string; // The character itself, e.g. "あ"
  text: string;     // Can be "あ" or "a"
  type: 'japanese' | 'romaji';
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC = () => {
  const [deckType, setDeckType] = useState<'hiragana' | 'katakana' | 'all'>('hiragana');
  const [charCategory, setCharCategory] = useState<'all' | 'basic' | 'dakuon' | 'yoon'>('basic');
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // sound effects
  const playSound = (frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext error", e);
    }
  };

  useEffect(() => {
    startNewGame();
    return () => stopTimer();
  }, [deckType, charCategory]);

  useEffect(() => {
    if (isPlaying && !isWon) {
      timerRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => stopTimer();
  }, [isPlaying, isWon]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startNewGame = () => {
    stopTimer();
    setTime(0);
    setMoves(0);
    setIsWon(false);
    setSelectedIndices([]);
    
    // 1. Gather characters based on filters from full alphabet data source
    let sourceChars: AlphabetCharacter[] = [];
    if (deckType === 'hiragana') {
      sourceChars = [...hiraganaAlphabet];
    } else if (deckType === 'katakana') {
      sourceChars = [...katakanaAlphabet];
    } else {
      sourceChars = [...hiraganaAlphabet, ...katakanaAlphabet];
    }

    if (charCategory !== 'all') {
      sourceChars = sourceChars.filter(c => c.category === charCategory);
    }

    // fallback in case filter produces too few items (should not happen with our 214-char db)
    if (sourceChars.length === 0) {
      sourceChars = deckType === 'hiragana' ? [...hiraganaAlphabet] : [...katakanaAlphabet];
    }

    // 2. Select 8 random characters (or less if pool is smaller)
    const pairsCount = Math.min(8, sourceChars.length);
    const selectedChars = [...sourceChars]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairsCount);

    // 3. Create cards
    const newCards: Card[] = [];
    selectedChars.forEach((char, idx) => {
      newCards.push({
        id: idx * 2,
        matchId: char.japanese,
        text: char.japanese,
        type: 'japanese',
        isFlipped: false,
        isMatched: false
      });
      newCards.push({
        id: idx * 2 + 1,
        matchId: char.japanese,
        text: char.romaji,
        type: 'romaji',
        isFlipped: false,
        isMatched: false
      });
    });

    // 4. Shuffle
    const shuffled = newCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIsPlaying(true);
  };

  const handleCardClick = (index: number) => {
    if (!isPlaying || isWon) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (selectedIndices.length >= 2) return;

    // Flip card
    playSound(440, 0.08); // Flip click sound
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newSelection = [...selectedIndices, index];
    setSelectedIndices(newSelection);

    if (newSelection.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newSelection;
      const card1 = cards[firstIdx];
      const card2 = cards[secondIdx];

      if (card1.matchId === card2.matchId && card1.type !== card2.type) {
        // MATCH!
        setTimeout(() => {
          playSound(587.33, 0.15, 'triangle'); // Match success sound
          const matchedCards = cards.map((c, idx) => {
            if (idx === firstIdx || idx === secondIdx) {
              return { ...c, isMatched: true };
            }
            return c;
          });
          setCards(matchedCards);
          const allMatched = matchedCards.every(c => c.isMatched);
          if (allMatched) {
            handleWin();
          }
          setSelectedIndices([]);
        }, 500);
      } else {
        // NO MATCH
        setTimeout(() => {
          playSound(220, 0.2); // Fail mismatch sound
          const flippedBack = cards.map((c, idx) => {
            if (idx === firstIdx || idx === secondIdx) {
              return { ...c, isFlipped: false };
            }
            return c;
          });
          setCards(flippedBack);
          setSelectedIndices([]);
        }, 1000);
      }
    }
  };

  const handleWin = () => {
    stopTimer();
    setIsWon(true);
    // Play celebratory sound
    setTimeout(() => {
      playSound(523.25, 0.1);
      setTimeout(() => {
        playSound(659.25, 0.1);
        setTimeout(() => {
          playSound(783.99, 0.15, 'triangle');
        }, 100);
      }, 100);
    }, 200);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="quiz-container" style={{ maxWidth: '750px', animation: 'fadeIn 0.4s ease' }}>
      <div className="page-title" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h2>🎮 Trò Chơi Luyện Phản Xạ</h2>
        <p>Lật thẻ và ghép đôi chữ cái tiếng Nhật với phiên âm Romaji tương ứng để tích lũy phản xạ nhanh!</p>
      </div>

      {/* Control board with double filters */}
      <div className="glass" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {/* Set Selector */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Bộ chữ:</span>
              <select 
                value={deckType} 
                onChange={(e) => setDeckType(e.target.value as any)}
                style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', outline: 'none', fontSize: '13px' }}
              >
                <option value="hiragana" style={{ background: 'var(--background)' }}>Hiragana</option>
                <option value="katakana" style={{ background: 'var(--background)' }}>Katakana</option>
                <option value="all" style={{ background: 'var(--background)' }}>Cả hai bảng</option>
              </select>
            </div>

            {/* Category Selector */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Phân loại:</span>
              <select 
                value={charCategory} 
                onChange={(e) => setCharCategory(e.target.value as any)}
                style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', outline: 'none', fontSize: '13px' }}
              >
                <option value="all" style={{ background: 'var(--background)' }}>Tất cả các chữ</option>
                <option value="basic" style={{ background: 'var(--background)' }}>Chữ cơ bản (Gojūon)</option>
                <option value="dakuon" style={{ background: 'var(--background)' }}>Âm đục (Dakuon)</option>
                <option value="yoon" style={{ background: 'var(--background)' }}>Âm ghép (Yōon)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: 600 }}>
            <span>⏱️ Thời gian: <span style={{ color: 'var(--primary)' }}>{formatTime(time)}</span></span>
            <span>👣 Lượt mở: <span style={{ color: 'var(--secondary)' }}>{moves}</span></span>
          </div>

        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--card-border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span>💡 Trò chơi tự động chọn ngẫu nhiên các cặp chữ phù hợp với bảng đấu để bạn luyện phản xạ.</span>
          <button 
            onClick={startNewGame} 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}
          >
            Tráo bài mới 🔄
          </button>
        </div>
      </div>

      {/* Game board */}
      {!isWon ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          margin: '0 auto',
          maxWidth: '500px'
        }}>
          {cards.map((card, idx) => {
            const isFlippedOrMatched = card.isFlipped || card.isMatched;
            
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                style={{
                  height: '100px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  perspective: '1000px',
                  transition: 'transform 0.2s'
                }}
                className="char-card-wrap"
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.5s',
                  transformStyle: 'preserve-3d',
                  transform: isFlippedOrMatched ? 'rotateY(180deg)' : 'none'
                }}>
                  {/* Card Front (Face down: standard look) */}
                  <div 
                    className="glass"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: 'var(--primary)',
                      border: '1px solid var(--card-border)'
                    }}
                  >
                    🌸
                  </div>

                  {/* Card Back (Face up: shows Japanese or Romaji) */}
                  <div 
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: card.text.length > 2 ? '15px' : card.text.length > 1 ? '20px' : '28px',
                      fontFamily: card.type === 'japanese' ? 'var(--font-ja)' : 'var(--font-ui)',
                      fontWeight: 'bold',
                      transform: 'rotateY(180deg)',
                      background: card.isMatched 
                        ? 'rgba(74, 214, 109, 0.15)' 
                        : card.type === 'japanese' ? 'var(--primary-light)' : 'rgba(78, 168, 222, 0.15)',
                      border: card.isMatched 
                        ? '2px solid var(--success)' 
                        : card.type === 'japanese' ? '2px solid var(--primary)' : '2px solid var(--secondary)',
                      color: card.isMatched 
                        ? 'var(--success)' 
                        : card.type === 'japanese' ? 'var(--primary)' : 'var(--secondary)',
                      boxShadow: card.isMatched ? '0 0 10px rgba(74, 214, 109, 0.2)' : 'none'
                    }}
                  >
                    {card.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Win panel
        <div className="quiz-card glass" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🏆</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '12px' }}>
            Chúc mừng bạn đã chiến thắng!
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Bạn đã hoàn thành trò chơi lật hình trong vòng **{formatTime(time)}** với **{moves} lượt mở bài**. <br />
            Khả năng ghi nhớ phản xạ của bạn thật tuyệt vời!
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => startNewGame()}>
              Chơi Lại Vòng Khác 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
