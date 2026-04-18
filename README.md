# 🔳 BLOG_SO

<div align="center">
  <img src="https://capsule-render.vercel.app/render?type=rect&color=000000&height=180&section=header&text=BLOG_SO&fontSize=80&fontAlignY=40&animation=fadeIn" width="100%" />

  <p><i>A blogging engine built with React, Appwrite, and Redux Toolkit.</i></p>

  <div>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  </div>
</div>

---

## ⚡ Overview
**BLOG_SO** is a modern content management platform designed". It provides a seamless pipeline for creators to publish, manage, and share artifacts.



## 🛠️ The Tech Stack
- **Interface:** React 18 (Vite)
- **Styling:** Tailwind CSS 4.0
- **State Engine:** Redux Toolkit (Auth Persistence)
- **Backend-as-a-Service:** Appwrite Cloud
- **Editor:** TinyMCE (Rich Text & Code injection)
- **Routing:** React Router DOM v6

---

## 🚀 Installation & Setup

### 1. Clone & Install
```bash
git clone [https://github.com/Mobeen0119/Blog_So.git](https://github.com/Mobeen0119/Blog_So.git)
cd Blog_So
npm install
2. Configure Environment
Create a .env file in the root directory and populate it with your Appwrite and TinyMCE credentials:

Code snippet
VITE_APPWRITE_URL="[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)"
VITE_APPWRITE_PROJECT_ID=""
VITE_APPWRITE_DATABASE_ID=""
VITE_APPWRITE_COLLECTION_ID=""
VITE_APPWRITE_BUCKET_ID=""
VITE_TINYMCE_API_KEY=""
3. Start Development
Bash
npm run dev
🏗️ Project Architecture
The codebase is organized into modular services to ensure scalability:

Plaintext
src/
├── appwrite/   # Auth.js and Database (configu.js) services
├── components/ # Atomic UI (Button, Input, RTE, Container)
├── store/      # Redux store and Auth slices
├── pages/      # Route-level components (Home, AllPosts, EditPost)
└── conf/       # Environment variable sanitization & export
💎 Features
Smart Slug Generation: Real-time title-to-URL transformation using custom slugTransform logic.

Media Pipeline: Automated image uploading to Appwrite Storage with a file-preview engine.

Secure Auth: Full session management including persistent login states via Redux.

Rich Text Control: Integrated TinyMCE editor with fallback support for raw text entry.
