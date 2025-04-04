/**
 * Обработчик темы для плавных переходов между страницами
 * Предотвращает мигание темы при навигации
 */

// Функция для установки атрибутов темы
function setThemeAttributes() {
  // Получаем сохраненную тему
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Устанавливаем тему
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Применяем тему при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Убираем класс js-loading, который скрывает контент
  document.documentElement.classList.remove('js-loading');
  
  // Обработчик изменения системной темы
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Если пользователь не установил тему вручную, следуем системным настройкам
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Отправляем событие для обновления UI
      document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: e.matches ? 'dark' : 'light' }
      }));
    }
  });
});

// Экспортируем функцию для использования в других файлах
export { setThemeAttributes };