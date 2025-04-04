import { useState, useEffect } from 'react';

// React-компонент для переключения темы с поддержкой гидратации
export default function ModeToggle({ className = "" }) {
  // Состояние темы: светлая (light) или темная (dark)
  const [theme, setTheme] = useState('light');
  
  // При монтировании компонента получаем текущую тему
  useEffect(() => {
    // Получаем текущую тему из HTML-атрибута или localStorage
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme);
    
    // Добавляем слушатель события изменения темы
    const handleThemeChange = (e) => {
      setTheme(e.detail.theme);
    };
    
    document.addEventListener('themeChanged', handleThemeChange);
    
    // Очистка при размонтировании
    return () => {
      document.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);
  
  // Обработчик переключения темы
  const toggleTheme = () => {
    // Используем глобальный API ThemeManager для изменения темы
    if (window.themeManager) {
      const newTheme = window.themeManager.toggle();
      setTheme(newTheme);
      
      // Запускаем перерисовку анимации при изменении темы (если доступна)
      if (window.initScene) {
        setTimeout(() => window.initScene(), 100);
      }
    }
  };
  
  return (
    <button 
      onClick={toggleTheme}
      aria-label="Переключить тему"
      className={`theme-toggle-button ${className}`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="sun-icon"
        style={{ opacity: theme === 'dark' ? 0 : 1 }}
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="moon-icon"
        style={{ opacity: theme === 'dark' ? 1 : 0 }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  );
} 