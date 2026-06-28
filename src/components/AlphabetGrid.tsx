import React, { useState } from 'react';
import { lessons } from '../data/lessons';
import { hiraganaAlphabet, katakanaAlphabet } from '../data/alphabet';
import type { AlphabetCharacter } from '../data/alphabet';
import { speakJapanese } from '../utils/speech';
import { CanvasTrainer } from './CanvasTrainer';

interface AlphabetGridProps {
  onLearnCharacter?: (char: any) => void;
}

export const AlphabetGrid: React.FC<AlphabetGridProps> = () => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'special'>('hiragana');
  const [specialSubTab, setSpecialSubTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedChar, setSelectedChar] = useState<any>(null);

  // Group characters based on tab selection
  const getCharactersByTab = () => {
    if (activeTab === 'hiragana') {
      return hiraganaAlphabet.filter(c => c.category === 'basic');
    }
    if (activeTab === 'katakana') {
      return katakanaAlphabet.filter(c => c.category === 'basic');
    }
    // special tab: show dakuon + yoon for selected sub-tab
    const sourceList = specialSubTab === 'hiragana' ? hiraganaAlphabet : katakanaAlphabet;
    return sourceList.filter(c => c.category === 'dakuon' || c.category === 'yoon');
  };

  const characters = getCharactersByTab();

  // Helper to restructure flat letters into standard Gojūon layout with placeholders
  const getStructuredCharacters = (flatChars: AlphabetCharacter[]) => {
    const isYoon = activeTab === 'special' && flatChars.some(c => c.category === 'yoon');
    const isBasic = activeTab !== 'special';

    if (isBasic && flatChars.length === 46) {
      const structured: any[] = [];
      // Rows 1-7: a, ka, sa, ta, na, ha, ma (35 chars)
      for (let i = 0; i < 35; i++) {
        structured.push(flatChars[i]);
      }
      // Row 8: ya, empty, yu, empty, yo (ya is 35, yu is 36, yo is 37)
      structured.push(flatChars[35]);
      structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'basic' });
      structured.push(flatChars[36]);
      structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'basic' });
      structured.push(flatChars[37]);
      
      // Row 9: ra, ri, ru, re, ro (38 to 42)
      for (let i = 38; i <= 42; i++) {
        structured.push(flatChars[i]);
      }
      
      // Row 10: wa, empty, empty, empty, wo (wa is 43, wo is 44)
      structured.push(flatChars[43]);
      structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'basic' });
      structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'basic' });
      structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'basic' });
      structured.push(flatChars[44]);
      
      // Row 11: n, empty, empty, empty, empty (n is 45)
      structured.push(flatChars[45]);
      structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'basic' });
      structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'basic' });
      structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'basic' });
      structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'basic' });
      
      return structured;
    }
    
    if (isYoon) {
      const dakuonPart = flatChars.filter(c => c.category === 'dakuon');
      const yoonPart = flatChars.filter(c => c.category === 'yoon');
      
      const structured: any[] = [];
      // Dakuon: 25 items -> 5 rows of 5
      structured.push(...dakuonPart);
      
      // Yoon: 36 items -> 12 consonant groups of 3
      // We add 2 empty slots after every 3 Yoon characters to align them in 12 rows of 5!
      for (let i = 0; i < yoonPart.length; i += 3) {
        if (i + 2 < yoonPart.length) {
          structured.push(yoonPart[i]);
          structured.push(yoonPart[i+1]);
          structured.push(yoonPart[i+2]);
          structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'yoon' });
          structured.push({ japanese: "", romaji: "", isEmpty: true, category: 'yoon' });
        } else {
          structured.push(yoonPart[i]);
        }
      }
      return structured;
    }
    
    return flatChars;
  };

  const structuredCharacters = getStructuredCharacters(characters);

  // Find rich details from lessons or generate fallbacks for Dakuten/Yoon
  const getRichDetails = (char: AlphabetCharacter) => {
    let matched = null;
    lessons.forEach(l => {
      l.characters.forEach(c => {
        if (c.japanese === char.japanese) {
          matched = c;
        }
      });
    });

    if (matched) return matched;

    // Fallback for Dakuten and Yoon
    return {
      japanese: char.japanese,
      romaji: char.romaji,
      mnemonic: char.category === 'dakuon'
        ? `Âm đục hoặc bán đục biến đổi từ phụ âm gốc. Đọc là /${char.romaji}/.`
        : `Âm ghép kết hợp giữa phụ âm hàng 'i' và chữ cái 'y' nhỏ (ya, yu, yo). Đọc là /${char.romaji}/.`,
      strokeCount: char.japanese.length === 1 ? 3 : 5,
      examples: []
    };
  };

  const handleCardClick = (char: AlphabetCharacter) => {
    speakJapanese(char.japanese);
    const richChar = getRichDetails(char);
    setSelectedChar(richChar);
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakJapanese(text);
  };

  return (
    <div>
      {/* Primary Tabs */}
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
          Âm biến đổi & Ghép (Dakuon & Yōon)
        </button>
      </div>

      {/* Special Sub-Tabs for Dakuon & Yōon */}
      {activeTab === 'special' && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
          <button
            className={`btn ${specialSubTab === 'hiragana' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '13px' }}
            onClick={() => setSpecialSubTab('hiragana')}
          >
            Bảng Hiragana (Chữ Mềm)
          </button>
          <button
            className={`btn ${specialSubTab === 'katakana' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '13px' }}
            onClick={() => setSpecialSubTab('katakana')}
          >
            Bảng Katakana (Chữ Cứng)
          </button>
        </div>
      )}

      {/* Grid rendering */}
      <div className="alphabet-grid">
        {structuredCharacters.map((char, index) => {
          if (char.isEmpty) {
            return (
              <div
                key={`empty-${index}`}
                className="char-card empty-card"
              ></div>
            );
          }

          let categoryLabel = '';
          if (char.category === 'dakuon') categoryLabel = 'Đục';
          if (char.category === 'yoon') categoryLabel = 'Ghép';

          return (
            <div
              key={`${char.japanese}-${index}`}
              className={`char-card glass ${char.category !== 'basic' ? 'special-char' : ''}`}
              onClick={() => handleCardClick(char)}
              style={{ position: 'relative' }}
            >
              {categoryLabel && (
                <span style={{ 
                  position: 'absolute', 
                  top: '6px', 
                  right: '6px', 
                  fontSize: '9px', 
                  background: char.category === 'dakuon' ? 'var(--secondary-hover)' : 'var(--primary-hover)',
                  color: 'white', 
                  padding: '2px 5px', 
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  {categoryLabel}
                </span>
              )}
              <span className="char-card-number">{index + 1}</span>
              <div className="char-jp" style={{ fontSize: char.japanese.length > 1 ? '24px' : '36px' }}>{char.japanese}</div>
              <div className="char-romaji">{char.romaji}</div>
              <div className="speaker-icon">🔊</div>
            </div>
          );
        })}
      </div>

      {/* Modal Detail view */}
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
                  style={{ cursor: 'pointer', fontSize: selectedChar.japanese.length > 2 ? '64px' : '96px' }}
                >
                  {selectedChar.japanese} 🔊
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
                    Độ phức tạp nét viết: {selectedChar.strokeCount}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="modal-section-title">Ghi nhớ & Cách đọc</h4>
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
                  {selectedChar.examples && selectedChar.examples.length > 0 ? (
                    <div className="examples-grid">
                      {selectedChar.examples.map((ex: any, idx: number) => (
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
                  ) : (
                    <div className="glass" style={{ padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      💡 Luyện phát âm và tập tô chữ trực quan bên trái để làm quen với nét chữ biến đổi này!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
