# Voice Task Manager

A modern **React Native** + **Expo** task management app with voice input powered by **OpenAI Whisper**.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---

## 📋 Overview

Voice Task Manager is a cross-platform (iOS & Android) app that lets you create, manage, and complete tasks — all with your voice.  
It’s fast, minimal, and built for modern productivity.

---

## ✨ Features

- ✅ Create, complete, and delete tasks  
- 🎤 Voice input using **OpenAI Whisper API**  
- 🌓 Dark / Light theme toggle  
- 📅 Due date management with quick selection  
- 🔍 Search and filter tasks  
- 💾 Local storage using `AsyncStorage`  
- 📱 Cross-platform (iOS & Android)

---

## ⚙️ Prerequisites

Before running the app, ensure you have:

- **Node.js** (v16 or higher) → [Download here](https://nodejs.org)
- **npm** or **yarn**
- **Expo CLI** (install globally):

  ```bash
  npm install -g expo-cli
  ```

- **Expo Go** app on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

---

## 🧩 Installation

1. **Clone or extract the project**

   ```bash
   git clone <repo-url>
   cd voice-task-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

---

## 🔑 Configure OpenAI API Key

The app uses **OpenAI Whisper API** for voice input.

### Option 1 — Quick Setup (Development Only)

Open `src/services/VoiceService.js` and replace the placeholder:

```javascript
const OPENAI_API_KEY = "your-actual-openai-api-key-here";
```

Get your key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Option 2 — Recommended (Environment Variables)

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your-key-here
```

Then in `VoiceService.js`:

```javascript
import { OPENAI_API_KEY } from "@env";
```

> ⚠️ **Never** commit your API key or `.env` file to version control.

---

## 🚀 Running the App

### Development Mode

Start the Expo development server:

```bash
npx expo start
# or
npm start
```

Open the **Expo Go** app and scan the QR code to load the project.

### Platform-Specific Commands

- **iOS (Mac only):**
  ```bash
  npx expo start --ios
  ```

- **Android:**
  ```bash
  npx expo start --android
  ```

- **Web (limited audio support):**
  ```bash
  npx expo start --web
  ```

---

## 🧭 Usage Guide

### ➕ Adding Tasks Manually
1. Tap the **blue +** button at the bottom right.
2. Enter a title (required).
3. Optionally add a description and due date.
4. Tap **Save Task**.

### 🎤 Adding Tasks with Voice
1. Tap the **purple microphone** button.
2. Speak your tasks, e.g.:
   > “Buy groceries and call dentist”
3. The app transcribes and adds multiple tasks — use **“and”** to separate tasks.

### 🧹 Managing Tasks
- **Complete:** Tap the checkbox.
- **Delete:** Tap the trash icon.
- **Search:** Use the search bar.
- **Theme:** Tap the sun/moon icon to toggle.

---

## 🧰 Troubleshooting

### Voice Input Not Working
- ✅ Check microphone permissions.
- ✅ Verify OpenAI API key is valid.
- ✅ Ensure internet connection is active.
- ✅ Run `npx expo start` and check logs for errors.

### App Won’t Start
Try clearing cache and reinstalling dependencies:

```bash
npx expo start -c
rm -rf node_modules
npm install
```

---

## 🏗️ Building for Production

This project supports **EAS Build**.

### Android (.AAB or .APK)
```bash
eas build --platform android
```

### iOS (.IPA)
```bash
eas build --platform ios
```

> ℹ️ EAS may generate `.aab` by default. To get `.apk`, modify the `build` profile or use `gradleCommand: ":app:assembleRelease"`.

---

## 🗂️ Project Structure

```
voice-task-manager/
├── App.tsx                      # Main app entry
├── src/
│   ├── screens/
│   │   ├── TaskList.js          # Task list screen
│   │   └── AddTask.tsx          # Add task screen
│   ├── services/
│   │   └── VoiceService.js      # Voice recording & transcription
│   └── utils/
│       ├── TaskParser.js        # Parse voice input into tasks
│       └── storage.js           # AsyncStorage helpers
├── package.json
└── README.md
```

---

## 🌱 Environment Variables

Example `.env`:

```env
OPENAI_API_KEY=sk-your-api-key
```

Load this key into `VoiceService.js` rather than hardcoding it.

---

## ⚠️ Known Limitations

- Requires internet for transcription.
- Whisper API usage incurs costs (see [pricing](https://openai.com/pricing)).
- Max recording duration: ~10 seconds.
- Web version has limited audio support.

---

## ⚡ Performance Tips

- Keep task descriptions under **500 characters**.
- Limit total tasks to **~1000** for smooth performance.
- Clear completed tasks periodically.

---

## 📚 References

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

## 🧡 License

This project is licensed under the **MIT License** — free for personal and commercial use.

> **Security Note:** Never commit your OpenAI API key to GitHub or public repos.
