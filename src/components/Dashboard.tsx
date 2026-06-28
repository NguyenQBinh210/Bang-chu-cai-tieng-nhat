import React from 'react';
import { lessons } from '../data/lessons';

interface DashboardProps {
  completedQuizzes: Record<number, number>; // lessonId -> highscore
  onSelectTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ completedQuizzes, onSelectTab }) => {
  // Statistics calculations
  const totalLessons = lessons.length;
  const passedLessons = Object.values(completedQuizzes).filter(score => score >= 80).length;
  
  // Total characters learned (sum of characters in completed lessons)
  const totalCharsLearned = lessons
    .filter(lesson => completedQuizzes[lesson.id] !== undefined)
    .reduce((sum, lesson) => sum + lesson.characters.length, 0);

  // Average quiz score
  const quizScores = Object.values(completedQuizzes);
  const averageScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((sum, val) => sum + val, 0) / quizScores.length)
    : 0;

  // Progress percentages
  const hiraganaPassed = lessons
    .filter(l => l.type === 'hiragana')
    .filter(l => (completedQuizzes[l.id] || 0) >= 80).length;
  const totalHiraganaLessons = lessons.filter(l => l.type === 'hiragana').length;
  const hiraganaProgress = totalHiraganaLessons > 0 ? Math.round((hiraganaPassed / totalHiraganaLessons) * 100) : 0;

  const katakanaPassed = lessons
    .filter(l => l.type === 'katakana')
    .filter(l => (completedQuizzes[l.id] || 0) >= 80).length;
  const totalKatakanaLessons = lessons.filter(l => l.type === 'katakana').length;
  const katakanaProgress = totalKatakanaLessons > 0 ? Math.round((katakanaPassed / totalKatakanaLessons) * 100) : 0;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="page-title" style={{ marginBottom: '32px' }}>
        <h2>Xin chào học viên! 👋</h2>
        <p>Hôm nay bạn muốn luyện tập phần nào? Xem tổng quan tiến trình bên dưới.</p>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-grid">
        <div className="stat-card glass">
          <div className="stat-icon">🎓</div>
          <div className="stat-value">{passedLessons} / {totalLessons}</div>
          <div className="stat-label">Bài học đã vượt qua</div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon">✍️</div>
          <div className="stat-value">{totalCharsLearned}</div>
          <div className="stat-label">Chữ cái đã học qua</div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{averageScore}%</div>
          <div className="stat-label">Điểm Quiz trung bình</div>
        </div>
      </div>

      {/* Progress Bars Section */}
      <div className="glass" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', marginBottom: '32px' }}>
        <h3 className="progress-title">Tiến trình học tập theo bảng chữ cái</h3>
        
        <div className="progress-section">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
              <strong>Bảng chữ mềm Hiragana</strong>
              <span>{hiraganaProgress}% hoàn thành</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${hiraganaProgress}%`, background: 'var(--primary)' }}></div>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
              <strong>Bảng chữ cứng Katakana</strong>
              <span>{katakanaProgress}% hoàn thành</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${katakanaProgress}%`, background: 'var(--secondary)' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Quick Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div 
          className="lesson-card-item glass" 
          onClick={() => onSelectTab('lessons')}
          style={{ borderLeft: '5px solid var(--primary)', cursor: 'pointer', padding: '20px' }}
        >
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Học theo bài giảng 📚</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Học phát âm, cách vẽ nét và ví dụ trực quan theo từng bài học ngắn.
            </p>
          </div>
        </div>

        <div 
          className="lesson-card-item glass" 
          onClick={() => onSelectTab('alphabet')}
          style={{ borderLeft: '5px solid var(--secondary)', cursor: 'pointer', padding: '20px' }}
        >
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Bảng tra cứu chữ cái 🔍</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Xem toàn bộ chữ cái Hiragana & Katakana, bấm để nghe âm thanh.
            </p>
          </div>
        </div>

        <div 
          className="lesson-card-item glass" 
          onClick={() => onSelectTab('vocab')}
          style={{ borderLeft: '5px solid var(--accent)', cursor: 'pointer', padding: '20px' }}
        >
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Học từ vựng 📝</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Luyện ôn 200 từ vựng từ bài tập với thẻ ghi nhớ 3D và Trắc nghiệm phản xạ.
            </p>
          </div>
        </div>

        <div 
          className="lesson-card-item glass" 
          onClick={() => onSelectTab('typing')}
          style={{ borderLeft: '5px solid var(--warning)', cursor: 'pointer', padding: '20px' }}
        >
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Luyện gõ chữ ⌨️</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Nhìn mặt chữ Nhật gõ phiên âm Romaji tương ứng chạy đua thời gian.
            </p>
          </div>
        </div>

        <div 
          className="lesson-card-item glass" 
          onClick={() => onSelectTab('game')}
          style={{ borderLeft: '5px solid var(--success)', cursor: 'pointer', padding: '20px' }}
        >
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Trò chơi Lật thẻ 🎮</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Rèn luyện phản xạ ghép cặp mặt chữ Hiragana/Katakana với Romaji.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
