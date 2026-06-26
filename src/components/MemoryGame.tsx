import React, { useState, useEffect, useRef } from 'react';
import { lessons } from '../data/lessons';

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
  }, [deckType]);

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
    
    // 1. Gather characters based on deckType
    const allChars: { j: string; r: string }[] = [];
    lessons.forEach(l => {
      if (deckType === 'all' || l.type === deckType) {
        l.characters.forEach(c => {
          // Prevent duplicates
          if (!allChars.some(item => item.j === c.japanese)) {
            allChars.push({ j: c.japanese, r: c.romaji });
          }
        });
      }
    });

    // 2. Select 8 random characters
    const selectedChars = [...allChars]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);

    if (selectedChars.length < 8) {
      // Fallback in case of insufficient chars (should not happen with our database)
      console.warn("Insufficient characters found");
    }

    // 3. Create 16 cards (8 Japanese, 8 Romaji)
    const newCards: Card[] = [];
    selectedChars.forEach((char, idx) => {
      newCards.push({
        id: idx * 2,
        matchId: char.j,
        text: char.j,
        type: 'japanese',
        isFlipped: false,
        isMatched: false
      });
      newCards.push({
        id: idx * 2 + 1,
        matchId: char.j,
        text: char.r,
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

      {/* Control panel & stats */}
      <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`tab-btn ${deckType === 'hiragana' ? 'active' : ''}`}
            onClick={() => setDeckType('hiragana')}
            style={{ padding: '6px 16px', fontSize: '13px' }}
          >
            Hiragana
          </button>
          <button 
            className={`tab-btn ${deckType === 'katakana' ? 'active' : ''}`}
            onClick={() => setDeckType('katakana')}
            style={{ padding: '6px 16px', fontSize: '13px' }}
          >
            Katakana
          </button>
          <button 
            className={`tab-btn ${deckType === 'all' ? 'active' : ''}`}
            onClick={() => setDeckType('all')}
            style={{ padding: '6px 16px', fontSize: '13px' }}
          >
            Tất cả
          </button>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '15px', fontWeight: 600 }}>
          <span>⏱️ Thời gian: <span style={{ color: 'var(--primary)' }}>{formatTime(time)}</span></span>
          <span>👣 Lượt mở: <span style={{ color: 'var(--secondary)' }}>{moves}</span></span>
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
                  height: '110px',
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
                      fontSize: card.type === 'japanese' ? '32px' : '22px',
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
