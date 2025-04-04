import { useState, useEffect } from 'react';

// React-компонент для мобильного меню с поддержкой интерактивности
export default function MobileMenu({ navItems = [] }) {
  // Состояние открытия/закрытия меню
  const [isOpen, setIsOpen] = useState(false);
  // Активный путь для выделения текущего пункта меню
  const [activePath, setActivePath] = useState('');
  
  // При монтировании компонента устанавливаем текущий путь
  useEffect(() => {
    setActivePath(window.location.pathname);
    
    // Обновляем активный путь при клиентской навигации
    const handleNavigation = () => {
      setActivePath(window.location.pathname);
    };
    
    // Закрываем меню при завершении клиентской навигации
    const handleNavigationComplete = () => {
      setIsOpen(false);
      setActivePath(window.location.pathname);
    };
    
    document.addEventListener('clientNavigationComplete', handleNavigationComplete);
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      document.removeEventListener('clientNavigationComplete', handleNavigationComplete);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);
  
  // Обработчик переключения меню
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    
    // Блокируем/разблокируем прокрутку страницы
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  // Проверка активного пункта меню
  const isActive = (path) => {
    if (path === '/') {
      return activePath === path;
    }
    return activePath === path || activePath.startsWith(`${path}/`);
  };
  
  return (
    <>
      {/* Кнопка меню */}
      <button 
        onClick={toggleMenu} 
        className="menu-button md:hidden flex items-center"
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>
      
      {/* Мобильное меню */}
      <div 
        className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`mobile-menu ${isOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-menu-header">
            <h2 className="text-xl font-bold">Меню</h2>
            <button 
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть"
              className="close-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <nav className="mobile-menu-nav">
            <ul>
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.link}
                    className={`mobile-nav-item ${isActive(item.link) ? 'active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
} 