/**
 * Клиентская навигация для Astro без полной перезагрузки страницы
 * Симулирует поведение SPA-фреймворков вроде React
 */

// CSS селекторы для элементов, которые должны сохранять свое состояние
const PERSISTENT_ELEMENTS = [
  'nav', // Навигационная панель
  '.theme-toggle-button', // Кнопка переключения темы
  '#theme-provider', // Провайдер темы
  'header', // Добавляем новый элемент - шапку сайта
  '.navbar', // Навбар
];

// CSS селекторы элементов, которые должны обновляться при каждой навигации
const CONTENT_SELECTORS = [
  'main',
  '.content-area',
  'article',
  'slot',
];

class ClientNavigation {
  constructor() {
    this.currentUrl = location.href;
    this.isNavigating = false;
    this.persistentElementsState = new Map();

    // Инициализация событий
    this.initEvents();
    
    // Сохраняем начальное состояние
    this.saveElementsState();
    
    console.log('✅ Клиентская навигация инициализирована');
    // Добавляем индикатор в консоль для дебага
    console.log('🔍 Текущий URL:', this.currentUrl);
    console.log('📋 Элементы для сохранения:', PERSISTENT_ELEMENTS);
    console.log('🔄 Элементы для обновления:', CONTENT_SELECTORS);
  }

  initEvents() {
    // Перехватываем клики по ссылкам
    document.addEventListener('click', (e) => this.handleLinkClick(e));
    
    // Обрабатываем события навигации браузера (назад/вперед)
    window.addEventListener('popstate', (e) => this.handlePopState(e));
  }

  // Обработка клика по ссылке
  handleLinkClick(e) {
    // Находим ближайший элемент ссылки
    const link = e.target.closest('a');
    
    // Проверяем, что это внутренняя ссылка, которую нужно обрабатывать
    if (link && this.shouldHandleNavigation(link)) {
      e.preventDefault();
      
      const targetUrl = link.href;
      this.navigateTo(targetUrl);
    }
  }

  // Проверка, нужно ли обрабатывать ссылку
  shouldHandleNavigation(link) {
    // Проверки на внутренние ссылки того же происхождения
    return link.href && 
           link.origin === window.location.origin && 
           !link.hasAttribute('target') && 
           !link.hasAttribute('download') &&
           !link.getAttribute('href').startsWith('#') &&
           !link.dataset.noClientNav;
  }

  // Обработка кнопок "назад" и "вперед" браузера
  handlePopState(e) {
    if (e.state) {
      this.navigateTo(location.href, false);
    }
  }

  // Основной метод навигации
  async navigateTo(url, addToHistory = true) {
    if (this.isNavigating || url === this.currentUrl) return;
    
    this.isNavigating = true;
    console.log('🚀 Навигация на:', url);
    
    // Отправляем событие начала навигации
    document.dispatchEvent(new CustomEvent('clientNavigationStart', { 
      detail: { url } 
    }));
    
    try {
      // Сохраняем состояние постоянных элементов
      this.saveElementsState();
      
      // Добавляем в историю браузера
      if (addToHistory) {
        history.pushState({}, '', url);
      }
      
      // Показываем индикатор загрузки
      this.showLoadingIndicator();
      
      // Добавляем класс для анимации ухода текущего контента
      this.addTransitionClasses();
      
      // Добавляем небольшую задержку для анимации ухода
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Загружаем новую страницу
      const newPageContent = await this.fetchPage(url);
      
      // Обновляем содержимое страницы
      this.updatePageContent(newPageContent);
      
      // Восстанавливаем состояние постоянных элементов
      this.restoreElementsState();
      
      // Обновляем текущий URL
      this.currentUrl = url;
      
      // Выполняем инлайн-скрипты на новой странице
      this.executeInlineScripts(newPageContent);
      
      // Восстанавливаем плавный скролл
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Сбрасываем флаг навигации
      this.isNavigating = false;
      
      // Отправляем событие успешной навигации
      document.dispatchEvent(new CustomEvent('clientNavigationComplete', { 
        detail: { url } 
      }));
      
      console.log('✅ Навигация завершена:', url);
      
      // Обновляем активные ссылки в навигации
      this.updateActiveNavLinks();
      
      // Добавляем класс для анимации прихода нового контента
      this.addEntryClasses();
    } catch (error) {
      console.error('❌ Ошибка при навигации:', error);
      
      // В случае ошибки делаем обычную навигацию
      window.location.href = url;
    } finally {
      // Скрываем индикатор загрузки
      this.hideLoadingIndicator();
    }
  }

  // Загрузка страницы через AJAX
  async fetchPage(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return await response.text();
  }

  // Сохранение состояния постоянных элементов
  saveElementsState() {
    this.persistentElementsState.clear();
    
    PERSISTENT_ELEMENTS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const id = element.id || this.generateTempId(element);
        this.persistentElementsState.set(id, {
          element,
          // Deep clone для сохранения DOM и состояния
          clone: element.cloneNode(true),
          // Сохраняем данные из JS, привязанные к элементу
          eventListeners: this.getElementEventListeners(element)
        });
      });
    });
  }

  // Генерация временного ID для элементов без ID
  generateTempId(element) {
    const tempId = `temp-id-${Math.random().toString(36).substr(2, 9)}`;
    element.dataset.tempId = tempId;
    return tempId;
  }

  // Извлечение обработчиков событий (упрощенная версия)
  getElementEventListeners(element) {
    // В реальном приложении здесь был бы код для сохранения обработчиков событий
    // Но без доступа к внутреннему API браузера это сложно
    return null;
  }

  // Обновление содержимого страницы
  updatePageContent(newPageHtml) {
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(newPageHtml, 'text/html');
    
    // Обновляем метаданные
    this.updateMetaTags(newDoc);
    
    // Обновляем заголовок страницы
    document.title = newDoc.title;
    
    // Находим и обновляем основной контент
    this.updateContentAreas(newDoc);
    
    // Обновляем URL в адресной строке
    if (history.state) {
      history.replaceState(
        { ...history.state, url: window.location.href },
        document.title,
        window.location.href
      );
    }
  }

  // Обновление метатегов
  updateMetaTags(newDoc) {
    const newMeta = Array.from(newDoc.querySelectorAll('meta[name], meta[property]'));
    
    // Удаляем старые и добавляем новые метатеги
    document.querySelectorAll('meta[name], meta[property]').forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      const newMetaTag = newMeta.find(m => 
        (m.getAttribute('name') === name) || (m.getAttribute('property') === name)
      );
      
      if (newMetaTag) {
        // Обновляем значение существующего метатега
        meta.setAttribute('content', newMetaTag.getAttribute('content'));
      } else {
        // Удаляем метатег, которого нет на новой странице
        meta.remove();
      }
    });
    
    // Добавляем новые метатеги, которых не было на старой странице
    newMeta.forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      if (!document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)) {
        document.head.appendChild(meta.cloneNode(true));
      }
    });
  }

  // Обновление основного содержимого
  updateContentAreas(newDoc) {
    let contentUpdated = false;
    
    // Перебираем селекторы контентных областей
    for (const selector of CONTENT_SELECTORS) {
      const currentContent = document.querySelector(selector);
      const newContent = newDoc.querySelector(selector);
      
      if (currentContent && newContent) {
        // Заменяем содержимое
        currentContent.innerHTML = newContent.innerHTML;
        contentUpdated = true;
      }
    }
    
    // Если не нашли контентных областей, обновляем body
    if (!contentUpdated) {
      // Но сохраняем постоянные элементы
      this.updateBodyContentPreservingElements(newDoc);
    }
  }

  // Обновление body с сохранением постоянных элементов
  updateBodyContentPreservingElements(newDoc) {
    // Сохраняем постоянные элементы в сторону
    const elementsToPreserve = [];
    
    PERSISTENT_ELEMENTS.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        elementsToPreserve.push({
          element,
          parent: element.parentNode,
          nextSibling: element.nextSibling
        });
        // Удаляем элемент из DOM, чтобы он не был перезаписан
        element.remove();
      });
    });
    
    // Обновляем содержимое body
    document.body.innerHTML = newDoc.body.innerHTML;
    
    // Возвращаем сохраненные элементы на их места
    elementsToPreserve.forEach(({ element, parent, nextSibling }) => {
      if (nextSibling) {
        parent.insertBefore(element, nextSibling);
      } else {
        parent.appendChild(element);
      }
    });
  }

  // Восстановление состояния постоянных элементов
  restoreElementsState() {
    this.persistentElementsState.forEach((state, id) => {
      let element;
      
      if (id.startsWith('temp-id-')) {
        element = document.querySelector(`[data-temp-id="${id}"]`);
      } else {
        element = document.getElementById(id);
      }
      
      // Если элемент найден и должен быть восстановлен
      if (element && state.clone) {
        // Восстанавливаем атрибуты
        Array.from(state.clone.attributes).forEach(attr => {
          element.setAttribute(attr.name, attr.value);
        });
        
        // Для некоторых элементов нужно сохранять значение
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
          element.value = state.clone.value;
        }
        
        // Восстанавливаем обработчики событий (упрощенно)
        // В реальном приложении здесь был бы код для восстановления обработчиков
      }
    });
  }

  // Выполнение инлайн-скриптов на новой странице
  executeInlineScripts(newPageHtml) {
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(newPageHtml, 'text/html');
    
    // Находим все скрипты на новой странице
    const scripts = Array.from(newDoc.querySelectorAll('script:not([src])'));
    
    // Выполняем скрипты в правильном порядке
    scripts.forEach(script => {
      try {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = script.textContent;
        document.head.appendChild(newScript);
        document.head.removeChild(newScript);
      } catch (error) {
        console.error('Ошибка при выполнении скрипта:', error);
      }
    });
  }

  // Добавление классов для анимации ухода
  addTransitionClasses() {
    // Находим контентные области
    const contentElements = document.querySelectorAll('.content-area');
    contentElements.forEach(element => {
      element.classList.add('content-exit');
    });
  }
  
  // Добавление классов для анимации прихода
  addEntryClasses() {
    // Находим контентные области
    const contentElements = document.querySelectorAll('.content-area');
    contentElements.forEach(element => {
      element.classList.remove('content-exit');
      element.classList.add('content-entry');
      
      // Удаляем классы после завершения анимации
      setTimeout(() => {
        element.classList.remove('content-entry');
      }, 500);
    });
  }

  // Показ индикатора загрузки
  showLoadingIndicator() {
    // Создаем или показываем индикатор загрузки
    let loader = document.querySelector('.client-nav-loader');
    
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'client-nav-loader';
      loader.innerHTML = `
        <div class="loader-bar"></div>
        <div class="loader-text">Загрузка...</div>
      `;
      document.body.appendChild(loader);
      
      // Добавляем стили для индикатора
      const style = document.createElement('style');
      style.innerHTML = `
        .client-nav-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          z-index: 9999;
        }
        .loader-bar {
          height: 100%;
          width: 0;
          background: linear-gradient(to right, #4299e1, #667eea, #764ba2);
          animation: loadingAnimation 2s ease-in-out infinite;
        }
        .loader-text {
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 12px;
        }
        @keyframes loadingAnimation {
          0% { width: 0; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        /* Классы для анимации контента */
        .content-exit {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.3s, transform 0.3s;
        }
        
        .content-entry {
          opacity: 0;
          transform: translateY(-10px);
          animation: contentEntry 0.5s forwards;
        }
        
        @keyframes contentEntry {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    loader.style.display = 'block';
  }

  // Скрытие индикатора загрузки
  hideLoadingIndicator() {
    const loader = document.querySelector('.client-nav-loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }

  // Обновление активных ссылок в навигации
  updateActiveNavLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('[data-nav-link]');
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('data-nav-link');
      const isRoot = linkPath === '/';
      
      // Логика определения активной ссылки
      const isActive = 
        currentPath === linkPath || 
        (!isRoot && currentPath.startsWith(`${linkPath}/`)) ||
        (isRoot && currentPath === '/');
      
      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Создаем и инициализируем навигацию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.clientNavigation = new ClientNavigation();
  
  // Добавляем сообщение о статусе навигации
  console.log('💡 Подсказка: Используйте клиентскую навигацию для плавного перехода между страницами');
});

// В браузере нельзя использовать export напрямую, делаем доступным через глобальную переменную
window.ClientNavigation = ClientNavigation; 