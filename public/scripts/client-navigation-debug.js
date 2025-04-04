/**
 * Дебаггер для клиентской навигации
 * Отслеживает все события и выводит их в консоль
 */

(function() {
  console.log('%c🔍 Дебаггер клиентской навигации запущен', 'background: #4299e1; color: white; padding: 4px 8px; border-radius: 4px;');
  
  // Проверка инициализации
  function checkInitialization() {
    if (window.clientNavigation) {
      console.log('%c✅ ClientNavigation инициализирован', 'color: green; font-weight: bold;');
    } else {
      console.log('%c❌ ClientNavigation НЕ инициализирован', 'color: red; font-weight: bold;');
      console.log('Возможные причины:');
      console.log('1. Скрипт не загружен');
      console.log('2. Скрипт загружен, но не выполнен');
      console.log('3. Ошибка при выполнении скрипта');
      
      // Проверка загрузки скрипта
      const scriptTags = document.querySelectorAll('script');
      let found = false;
      
      scriptTags.forEach(script => {
        if (script.src && script.src.includes('client-navigation.js')) {
          found = true;
          console.log('%c📄 Скрипт клиентской навигации найден:', 'color: blue;', script.src);
        }
      });
      
      if (!found) {
        console.log('%c❌ Скрипт клиентской навигации не найден в DOM', 'color: red;');
      }
    }
  }
  
  // Слушаем события навигации
  function listenToNavigationEvents() {
    document.addEventListener('clientNavigationStart', (e) => {
      console.log('%c🚀 Начало навигации:', 'background: #805ad5; color: white; padding: 2px 6px; border-radius: 4px;', e.detail.url);
      console.time('⏱️ Время навигации');
    });
    
    document.addEventListener('clientNavigationComplete', (e) => {
      console.log('%c✅ Завершение навигации:', 'background: #68d391; color: white; padding: 2px 6px; border-radius: 4px;', e.detail.url);
      console.timeEnd('⏱️ Время навигации');
      
      // Проверяем наличие необходимых классов
      const contentAreas = document.querySelectorAll('.content-area');
      if (contentAreas.length === 0) {
        console.warn('%c⚠️ Элементы с классом .content-area не найдены!', 'color: orange; font-weight: bold;');
      } else {
        console.log('%c✅ Найдены элементы content-area:', 'color: green;', contentAreas.length);
      }
    });
    
    // Отслеживаем обычные навигации
    window.addEventListener('beforeunload', () => {
      console.log('%c🔄 Обычная навигация с перезагрузкой страницы', 'background: #e53e3e; color: white; padding: 2px 6px; border-radius: 4px;');
    });
  }
  
  // Проверка наличия необходимых классов
  function checkRequiredElements() {
    const contentAreas = document.querySelectorAll('.content-area');
    if (contentAreas.length === 0) {
      console.warn('%c⚠️ Элементы с классом .content-area не найдены!', 'color: orange; font-weight: bold;');
    } else {
      console.log('%c✅ Найдены элементы content-area:', 'color: green;', contentAreas.length);
    }
    
    const persistentElements = ['nav', '.theme-toggle-button', '#theme-provider', 'header', '.navbar'];
    let foundPersistent = 0;
    
    persistentElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        foundPersistent++;
        console.log(`%c✅ Найден постоянный элемент ${selector}:`, 'color: green;', elements.length);
      }
    });
    
    if (foundPersistent === 0) {
      console.warn('%c⚠️ Ни один постоянный элемент не найден!', 'color: orange; font-weight: bold;');
    }
    
    // Проверяем наличие функций анимации
    if (window.initScene) {
      console.log('%c✅ Функция initScene доступна глобально', 'color: green;');
    } else {
      console.warn('%c⚠️ Функция initScene не обнаружена!', 'color: orange; font-weight: bold;');
    }
    
    if (window.fullRestart) {
      console.log('%c✅ Функция fullRestart доступна глобально', 'color: green;');
    } else {
      console.warn('%c⚠️ Функция fullRestart не обнаружена!', 'color: orange; font-weight: bold;');
    }
    
    // Для тестирования запуска анимации
    console.log('%c📋 Диагностика: Для принудительного перезапуска анимации выполните в консоли:', 'background: #2c5282; color: white; padding: 4px 8px; border-radius: 4px;');
    console.log('window.fullRestart ? window.fullRestart() : window.initScene()');
  }
  
  // Запуск проверок после полной загрузки страницы
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      checkInitialization();
      listenToNavigationEvents();
      checkRequiredElements();
      
      console.log('%c📋 Инструкция по отладке:', 'background: #2c5282; color: white; padding: 4px 8px; border-radius: 4px;');
      console.log('1. Перейдите по ссылкам на сайте и проверьте логи');
      console.log('2. Следите за событиями clientNavigationStart и clientNavigationComplete');
      console.log('3. Проверьте время навигации - должно быть не более 1-2 секунд');
      console.log('4. Если видите ошибки, проверьте структуру HTML и наличие классов content-area');
    }, 1000); // Даем время на инициализацию
  });
})(); 