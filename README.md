# Astro Текстовые Частицы

Интерактивный проект, демонстрирующий анимацию частиц, формирующих текст, с настраиваемой темной/светлой темой.

## 🌟 Особенности

- ✨ Анимация частиц, формирующих текст
- 🌓 Переключатель темного/светлого режима
- 📱 Адаптивный дизайн с мобильной и десктопной версиями
- 🎨 Интерактивность - взаимодействие частиц с курсором мыши
- 🚀 Быстрый и производительный (построен на Astro)
- 🏁 Плавные анимации загрузки страниц

## 🚀 Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск сервера разработки
npm run dev

# Сборка для production
npm run build
```

## 🧞 Интерактивные элементы

- **Ввод текста**: Введите текст в поле внизу экрана для изменения текста из частиц
- **Взаимодействие с мышью**: Частицы реагируют на движение курсора
- **Клик**: Изменяет радиус взаимодействия с мышью
- **Переключатель темы**: Переключает между светлой и темной темой

## 🔄 Структура проекта

- `src/components/` — Компоненты UI, включая навбар и переключатель темы
- `src/layouts/` — Шаблоны страниц
- `src/pages/` — Страницы сайта, включая главную с анимацией частиц
- `src/styles/` — Глобальные стили приложения

## 🛠️ Технический стек

- [Astro](https://astro.build/)
- JavaScript (Canvas API)
- CSS (с переменными для тем)

## 📄 Лицензия

MIT

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
