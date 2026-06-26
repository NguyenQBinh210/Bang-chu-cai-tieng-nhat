import React from 'react';
import { lessons, type Lesson } from '../data/lessons';

interface LectureListProps {
  onSelectLesson: (lesson: Lesson) => void;
  completedQuizzes: Record<number, number>; // maps lessonId -> highscore percentage
}

export const LectureList: React.FC<LectureListProps> = ({ onSelectLesson, completedQuizzes }) => {
  return (
    <div className="lecture-container">
      <div className="page-title" style={{ marginBottom: '24px' }}>
        <h2>Hệ thống bài giảng tiếng Nhật</h2>
        <p>Lộ trình được thiết kế bài bản từ nguyên âm cơ bản đến các quy tắc biến âm phức tạp.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {lessons.map((lesson) => {
          const score = completedQuizzes[lesson.id];
          const isPassed = score !== undefined && score >= 80;
          
          return (
            <div
              key={lesson.id}
              className="lesson-card-item glass"
              onClick={() => onSelectLesson(lesson)}
              style={{
                borderLeft: isPassed ? '5px solid var(--success)' : '5px solid var(--primary)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{lesson.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {lesson.description}
                </p>
                <div className="lesson-meta">
                  <span className={`badge ${lesson.type}`}>
                    {lesson.type === 'hiragana' ? 'Hiragana' : lesson.type === 'katakana' ? 'Katakana' : 'Biến âm & Ghép'}
                  </span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                    {lesson.characters.length} chữ cái
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                {score !== undefined ? (
                  <div className="lesson-score" style={{ color: isPassed ? 'var(--success)' : 'var(--warning)' }}>
                    Quiz: {score}% {isPassed ? '✓ Đạt' : '✗ Chưa đạt'}
                  </div>
                ) : (
                  <div className="lesson-score" style={{ opacity: 0.6 }}>
                    Chưa làm Quiz
                  </div>
                )}
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                >
                  Học ngay
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
