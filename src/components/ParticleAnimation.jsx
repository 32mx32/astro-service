import { useState, useEffect, useRef } from 'react';

// React-компонент для интерактивной анимации частиц
export default function ParticleAnimation({ text = 'ASTRO', className = '' }) {
  // Ссылка на canvas элемент
  const canvasRef = useRef(null);
  // Ссылка на input для изменения текста
  const inputRef = useRef(null);
  // Состояние для текста
  const [canvasText, setCanvasText] = useState(text);
  // Состояние радиуса взаимодействия
  const [radius, setRadius] = useState(1);
  // Храним частицы и цвета в refs
  const particlesRef = useRef([]);
  const colorsRef = useRef([]);
  // Координаты мыши
  const mouseRef = useRef({ x: 0, y: 0 });
  // Контекст для рисования
  const ctxRef = useRef(null);
  // Размеры canvas
  const dimensionsRef = useRef({ width: 0, height: 0 });
  
  // Получение цветов из CSS переменных
  const getParticleColors = () => {
    if (typeof window === 'undefined') return ['#ffffff'];
    
    const colorsString = getComputedStyle(document.documentElement)
      .getPropertyValue('--particle-colors')
      .trim();
    return colorsString.split(',').map(color => color.trim());
  };
  
  // Класс для представления частицы
  class Particle {
    constructor(x, y) {
      this.x = Math.random() * dimensionsRef.current.width;
      this.y = Math.random() * dimensionsRef.current.height;
      this.dest = { x, y };
      this.r = Math.random() * 5 + 2;
      this.vx = (Math.random() - 0.5) * 20;
      this.vy = (Math.random() - 0.5) * 20;
      this.accX = 0;
      this.accY = 0;
      this.friction = Math.random() * 0.05 + 0.94;
      this.color = colorsRef.current[Math.floor(Math.random() * colorsRef.current.length)];
    }
    
    render() {
      this.accX = (this.dest.x - this.x) / 1000;
      this.accY = (this.dest.y - this.y) / 1000;
      this.vx += this.accX;
      this.vy += this.accY;
      this.vx *= this.friction;
      this.vy *= this.friction;
      
      this.x += this.vx;
      this.y += this.vy;
      
      ctxRef.current.fillStyle = this.color;
      ctxRef.current.beginPath();
      ctxRef.current.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctxRef.current.fill();
      
      const a = this.x - mouseRef.current.x;
      const b = this.y - mouseRef.current.y;
      
      const distance = Math.sqrt(a*a + b*b);
      if (distance < (radius * 70)) {
        this.accX = (this.x - mouseRef.current.x) / 100;
        this.accY = (this.y - mouseRef.current.y) / 100;
        this.vx += this.accX;
        this.vy += this.accY;
      }
    }
  }
  
  // Инициализация сцены
  const initScene = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    
    // Обновляем цвета
    colorsRef.current = getParticleColors();
    
    // Обновляем размеры canvas
    dimensionsRef.current = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    canvasRef.current.width = dimensionsRef.current.width;
    canvasRef.current.height = dimensionsRef.current.height;
    
    // Очищаем canvas
    ctxRef.current.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
    
    // Рисуем текст (невидимый, только для создания частиц)
    ctxRef.current.font = `bold ${dimensionsRef.current.width / 10}px sans-serif`;
    ctxRef.current.textAlign = "center";
    ctxRef.current.fillText(canvasText, dimensionsRef.current.width / 2, dimensionsRef.current.height / 2);
    
    // Получаем данные изображения
    const imageData = ctxRef.current.getImageData(0, 0, dimensionsRef.current.width, dimensionsRef.current.height).data;
    ctxRef.current.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
    ctxRef.current.globalCompositeOperation = "screen";
    
    // Создаем частицы
    particlesRef.current = [];
    for (let i = 0; i < dimensionsRef.current.width; i += Math.round(dimensionsRef.current.width / 150)) {
      for (let j = 0; j < dimensionsRef.current.height; j += Math.round(dimensionsRef.current.width / 150)) {
        if (imageData[((i + j * dimensionsRef.current.width) * 4) + 3] > 150) {
          particlesRef.current.push(new Particle(i, j));
        }
      }
    }
  };
  
  // Функция анимации
  const animate = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    
    requestAnimationFrame(animate);
    ctxRef.current.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
    
    for (let i = 0; i < particlesRef.current.length; i++) {
      particlesRef.current[i].render();
    }
  };
  
  // Обработчики событий мыши/касания
  const handleMouseMove = (e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  
  const handleTouchEnd = () => {
    mouseRef.current = { x: -9999, y: -9999 };
  };
  
  const handleClick = () => {
    setRadius((prev) => (prev >= 4 ? 1 : prev + 1));
  };
  
  // Полный перезапуск анимации
  const fullRestart = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    
    // Очищаем canvas
    ctxRef.current.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
    
    // Пересоздаем сцену
    initScene();
    
    console.log('🔄 React-анимация полностью перезапущена');
  };
  
  // Изменение текста
  const handleTextChange = (e) => {
    setCanvasText(e.target.value);
    
    // Перезапускаем анимацию с новым текстом
    setTimeout(initScene, 10);
  };
  
  // Инициализация компонента
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Получаем контекст для рисования
    ctxRef.current = canvasRef.current.getContext('2d');
    
    // Инициализируем сцену и запускаем анимацию
    initScene();
    requestAnimationFrame(animate);
    
    // Добавляем обработчики событий
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', initScene);
    
    // Добавляем глобальные функции для внешнего доступа
    window.reactInitScene = initScene;
    window.reactFullRestart = fullRestart;
    
    // Обработчик клиентской навигации
    const handleNavigationComplete = (e) => {
      // Проверяем, что мы находимся на странице с анимацией
      if (canvasRef.current) {
        console.log('🔄 Перезапуск React-анимации при навигации на:', e.detail.url);
        fullRestart();
      }
    };
    
    document.addEventListener('clientNavigationComplete', handleNavigationComplete);
    
    // Очистка при размонтировании
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', initScene);
      document.removeEventListener('clientNavigationComplete', handleNavigationComplete);
      
      // Удаляем глобальные функции
      delete window.reactInitScene;
      delete window.reactFullRestart;
    };
  }, []);
  
  // Обновление анимации при изменении текста
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = canvasText;
    }
  }, [canvasText]);
  
  return (
    <div className={`particle-animation-container ${className}`}>
      <canvas 
        ref={canvasRef} 
        id="react-scene"
        className="absolute inset-0 w-full h-full"
      />
      
      <div className="text-input-container fixed bottom-8 w-full text-center z-40 flex flex-col items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          defaultValue={canvasText}
          onChange={handleTextChange}
          className="w-64 h-10 text-center bg-transparent text-2xl border border-current rounded-lg"
        />
        <p className="text-sm opacity-60 hover:opacity-100 transition-opacity">
          Кликните в любом месте для изменения радиуса взаимодействия с мышью
        </p>
      </div>
    </div>
  );
} 