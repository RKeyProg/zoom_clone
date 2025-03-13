<div align="center">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

  <h3 align="center">A Zoom Clone</h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🤖 [Настройка AI-чат бота](#chatbot)
6. 🧠 [AI-функции в видеозвонках](#ai-features)

## <a name="introduction">🤖 Introduction</a>

Built with the latest Next.js and TypeScript, this project replicates Zoom, a widely used video conferencing tool. It enables users to securely log in, create meetings and access various meeting functionalities such as recording, screen sharing, and managing participants.

## <a name="chatbot">🤖 Настройка AI-чат бота</a>

Приложение включает в себя AI-чат бота на базе Deepseek API. Для корректной работы следуйте инструкциям:

1. Получите API-ключ на [платформе Deepseek](https://platform.deepseek.com/)
2. Создайте файл `.env.local` в корне проекта (можно скопировать из `.env.local.example`)
3. Добавьте ваш API-ключ в переменную окружения `NEXT_PUBLIC_DEEPSEEK_API_KEY`

Пример:

```
NEXT_PUBLIC_DEEPSEEK_API_KEY=sk-your-api-key-here
```

После настройки API-ключа чат-бот будет полностью функциональным и сможет отвечать на вопросы пользователей.

Особенности чат-бота:

- Интеграция с Deepseek AI
- Сохранение контекста беседы
- Красивый и интуитивно понятный интерфейс
- Возможность копирования сообщений
- Индикация загрузки при ожидании ответа

## <a name="ai-features">🧠 AI-функции в видеозвонках</a>

Приложение оснащено расширенными AI-возможностями, которые делают видеоконференции более продуктивными и доступными:

### 🎯 Автоматические субтитры и перевод

Во время звонка вы можете включить функцию субтитров, которая:

- В реальном времени распознает речь участников
- Отображает текст с указанием говорящего
- Поддерживает перевод на несколько языков (русский, английский, испанский, французский, немецкий, китайский)
- Сохраняет историю субтитров для просмотра

Для включения нажмите кнопку с иконкой сообщения в нижней панели управления звонком.

### 📝 Умный ассистент для встреч

Ассистент встречи анализирует содержание разговора и предоставляет полезную информацию:

- Создает краткие резюме всей встречи
- Выделяет ключевые моменты и решения
- Формирует список задач с возможностью отслеживания
- Анализирует эмоциональный тон обсуждения

Для использования ассистента нажмите на кнопку с иконкой робота в нижней панели управления звонком.

### ⚙️ Настройка AI-функций

Все AI-функции используют тот же API-ключ Deepseek, что и чат-бот:

1. Проверьте, что у вас настроен API-ключ в `.env.local` (см. раздел "Настройка AI-чат бота")
2. API-ключ должен быть добавлен в переменную окружения `NEXT_PUBLIC_DEEPSEEK_API_KEY`

После настройки API-ключа все AI-функции будут доступны автоматически.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- TypeScript
- Clerk
- getstream
- shadcn
- Tailwind CSS
- Deepseek API
- Stream SDK для транскрипции речи

## <a name="features">🔋 Features</a>

👉 **Authentication**: Implements authentication and authorization features using Clerk, allowing users to securely log in via social sign-on or traditional email and password methods, while ensuring appropriate access levels and permissions within the platform.

👉 **New Meeting**: Quickly start a new meeting, configuring camera and microphone settings before joining.

👉 **Meeting Controls**: Participants have full control over meeting aspects, including recording, emoji reactions, screen sharing, muting/unmuting, sound adjustments, grid layout, participant list view, and individual participant management (pinning, muting, unmuting, blocking, allowing video share).

👉 **Exit Meeting**: Participants can leave a meeting, or creators can end it for all attendees.

👉 **Schedule Future Meetings**: Input meeting details (date, time) to schedule future meetings, accessible on the 'Upcoming Meetings' page for sharing the link or immediate start.

👉 **Past Meetings List**: Access a list of previously held meetings, including details and metadata.

👉 **View Recorded Meetings**: Access recordings of past meetings for review or reference.

👉 **Personal Room**: Users have a personal room with a unique meeting link for instant meetings, shareable with others.

👉 **Join Meetings via Link**: Easily join meetings created by others by providing a link.

👉 **Secure Real-time Functionality**: All interactions within the platform are secure and occur in real-time, maintaining user privacy and data integrity.

👉 **Responsive Design**: Follows responsive design principles to ensure optimal user experience across devices, adapting seamlessly to different screen sizes and resolutions.

👉 **AI-powered Chat Bot**: Integrated Deepseek AI chat assistant that can respond to user queries, provide technical support, and enhance meeting experience.

👉 **Real-time Transcription & Translation**: Automatic speech recognition with support for multiple languages, enabling accessibility and cross-language communication during calls.

👉 **Meeting Assistant**: Smart AI tool that analyzes meeting content to provide summaries, extract action items, key points, and decisions, helping teams stay organized.

and many more, including code architecture and reusability.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/RKeyProg/zoom_clone.git
cd zoom_clone
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET_KEY=
```

Replace the placeholder values with your actual Clerk & getstream credentials. You can obtain these credentials by signing up on the [Clerk website](https://clerk.com/) and [getstream website](https://getstream.io/)

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

#
