import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { AlphabetGrid } from './components/AlphabetGrid';
import { LectureList } from './components/LectureList';
import { LectureSlide } from './components/LectureSlide';
import { QuizRunner } from './components/QuizRunner';
import { WorksheetTrainer } from './components/WorksheetTrainer';
import { MemoryGame } from './components/MemoryGame';
import { VocabTrainer } from './components/VocabTrainer';
import { TypingGame } from './components/TypingGame';
import type { Lesson } from './data/lessons';

type ViewState = 'dashboard' | 'alphabet' | 'lessons' | 'lecture' | 'quiz' | 'worksheet' | 'game' | 'vocab' | 'typing';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  // Progress tracking: lessonId -> quizScorePercentage
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('japanese_learning_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Dark/Light Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('japanese_learning_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Mobile sidebar state
  const [sidebarActive, setSidebarActive] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('japanese_learning_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleFinishQuiz = (scorePercent: number) => {
    if (!selectedLesson) return;
    
    const newProgress = {
      ...completedQuizzes,
      [selectedLesson.id]: Math.max(completedQuizzes[selectedLesson.id] || 0, scorePercent)
    };
    
    setCompletedQuizzes(newProgress);
    localStorage.setItem('japanese_learning_progress', JSON.stringify(newProgress));
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('lecture');
    setSidebarActive(false);
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    setSelectedLesson(null);
    setSidebarActive(false);
  };

  // Calculate overall progress for the sidebar widget
  const passedLessons = Object.values(completedQuizzes).filter(score => score >= 80).length;
  const progressPercent = passedLessons > 0 ? Math.round((passedLessons / 20) * 100) : 0;

  const isLessonsViewActive = 
    currentView === 'lessons' || 
    currentView === 'lecture' || 
    currentView === 'quiz' || 
    currentView === 'worksheet';

  return (
    <div className="app-container">
      {/* Mobile Sidebar Backdrop overlay */}
      {sidebarActive && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setSidebarActive(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
            animation: 'fadeIn 0.3s ease'
          }}
        ></div>
      )}

      {/* Sidebar navigation */}
      <aside className={`sidebar glass ${sidebarActive ? 'active' : ''}`}>
        <div className="logo-section">
          <div className="logo-icon">あ</div>
          <div className="logo-text">
            <h1>Nhật Ngữ Việt</h1>
            <p>Học Tiếng Nhật Trực Quan</p>
          </div>
        </div>

        <nav className="nav-menu">
          <li className="nav-item">
            <button
              className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavigate('dashboard')}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              🏠 Tổng Quan
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentView === 'alphabet' ? 'active' : ''}`}
              onClick={() => handleNavigate('alphabet')}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              🇯🇵 Bảng Chữ Cái
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${isLessonsViewActive ? 'active' : ''}`}
              onClick={() => handleNavigate('lessons')}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              📚 Bài Giảng & Quiz
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentView === 'vocab' ? 'active' : ''}`}
              onClick={() => handleNavigate('vocab')}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              📝 Học Từ Vựng
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentView === 'typing' ? 'active' : ''}`}
              onClick={() => handleNavigate('typing')}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              ⌨️ Luyện Gõ Chữ
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentView === 'game' ? 'active' : ''}`}
              onClick={() => handleNavigate('game')}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              🎮 Luyện Phản Xạ
            </button>
          </li>
        </nav>

        <div className="sidebar-footer">
          {/* Progress widget */}
          <div className="progress-widget">
            <div className="progress-header">
              <span>Khóa học</span>
              <span>{progressPercent}% hoàn thành</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* Theme switcher */}
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng'}
          </button>
        </div>
      </aside>

      {/* Main content body */}
      <main className="main-content">
        <header className="top-bar">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setSidebarActive(!sidebarActive)}
            title="Mở menu"
          >
            ☰
          </button>
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '13px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '15px', fontWeight: 600 }}>
              Sơ cấp N5
            </span>
          </div>
        </header>

        {/* View Switcher Router */}
        {currentView === 'dashboard' && (
          <Dashboard 
            completedQuizzes={completedQuizzes} 
            onSelectTab={(tab) => handleNavigate(tab as ViewState)} 
          />
        )}

        {currentView === 'alphabet' && (
          <AlphabetGrid />
        )}

        {currentView === 'lessons' && (
          <LectureList 
            onSelectLesson={handleSelectLesson} 
            completedQuizzes={completedQuizzes} 
          />
        )}

        {currentView === 'lecture' && selectedLesson && (
          <LectureSlide
            lesson={selectedLesson}
            onBack={() => setCurrentView('lessons')}
            onStartQuiz={() => setCurrentView('quiz')}
            onStartWorksheet={() => setCurrentView('worksheet')}
          />
        )}

        {currentView === 'quiz' && selectedLesson && (
          <QuizRunner
            lesson={selectedLesson}
            onFinishQuiz={handleFinishQuiz}
            onBack={() => setCurrentView('lecture')}
          />
        )}

        {currentView === 'worksheet' && selectedLesson && (
          <WorksheetTrainer
            lesson={selectedLesson}
            onBack={() => setCurrentView('lecture')}
          />
        )}

        {currentView === 'game' && (
          <MemoryGame />
        )}

        {currentView === 'vocab' && (
          <VocabTrainer />
        )}

        {currentView === 'typing' && (
          <TypingGame />
        )}
      </main>
    </div>
  );
}

export default App;
