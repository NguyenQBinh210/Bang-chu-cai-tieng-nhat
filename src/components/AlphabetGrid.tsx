import React, { useState } from 'react';
import { lessons, type Character } from '../data/lessons';
import { speakJapanese } from '../utils/speech';
import { CanvasTrainer } from './CanvasTrainer';

interface AlphabetGridProps {
  onLearnCharacter?: (char: Character) => void;
}

export const AlphabetGrid: React.FC<AlphabetGridProps> = () => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'special'>('hiragana');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  // Group characters from lessons based on type
  const getCharactersByTab = () => {
    const list: Character[] = [];
    lessons.forEach(lesson => {
      if (lesson.type === activeTab) {
        list.push(...lesson.characters);
      }
    });
    return list;
  };

  const characters = getCharactersByTab();

  const handleCardClick = (char: Character) => {
    speakJapanese(char.japanese);
    setSelectedChar(char);
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakJapanese(text);
  };

  // Construct table structure with gaps for standard 50-sound look (Gojūon)
  // For simplicity and fluid design, we render standard grid cards, but we can arrange them logically.
  return (
    <div>
      <div className="tab-container">
        <button
          className={`tab-btn ${activeTab === 'hiragana' ? 'active' : ''}`}
          onClick={() => setActiveTab('hiragana')}
        >
          Hiragana (Chữ Mềm)
        </button>
        <button
          className={`tab-btn ${activeTab === 'katakana' ? 'active' : ''}`}
          onClick={() => setActiveTab('katakana')}
        >
          Katakana (Chữ Cứng)
        </button>
        <button
          className={`tab-btn ${activeTab === 'special' ? 'active' : ''}`}
          onClick={() => setActiveTab('special')}
        >
          Âm biến đổi & Ghép
        </button>
      </div>

      <div className="alphabet-grid">
        {characters.map((char, index) => (
          <div
            key={`${char.japanese}-${index}`}
            className="char-card glass"
            onClick={() => handleCardClick(char)}
          >
            <span className="char-card-number">{index + 1}</span>
            <div className="char-jp">{char.japanese}</div>
            <div className="char-romaji">{char.romaji}</div>
            <div className="speaker-icon">🔊</div>
          </div>
        ))}
      </div>

      {selectedChar && (
        <div className="modal-overlay" onClick={() => setSelectedChar(null)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedChar(null)}>
              ✕
            </button>
            
            <div className="modal-body">
              <div className="modal-header-info">
                <div 
                  className="modal-jp-large" 
                  title="Nhấp để nghe lại phát âm"
                  onClick={() => speakJapanese(selectedChar.japanese)}
                >
                  {selectedChar.japanese}
                </div>
                <div className="modal-meta-info">
                  <span className="modal-romaji-large">/ {selectedChar.romaji} /</span>
                  <button 
                    className="modal-speak-badge"
                    onClick={(e) => handleSpeak(e, selectedChar.japanese)}
                  >
                    <span>Phát âm</span> 🔊
                  </button>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Số nét viết: {selectedChar.strokeCount}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="modal-section-title">Mẹo nhớ nhanh</h4>
                <div className="mnemonic-box">
                  💡 {selectedChar.mnemonic}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                  <h4 className="modal-section-title">Luyện viết nét</h4>
                  <CanvasTrainer character={selectedChar.japanese} />
                </div>

                <div>
                  <h4 className="modal-section-title">Từ vựng ví dụ</h4>
                  <div className="examples-grid">
                    {selectedChar.examples.map((ex, idx) => (
                      <div 
                        key={idx} 
                        className="example-card glass"
                        onClick={(e) => handleSpeak(e, ex.word)}
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
        </div>
      )}
    </div>
  );
};
