Blog_So

Overview
- React + Vite single-page app for blogging with Appwrite backend.
- Rich text posts (TinyMCE), image uploads (Appwrite Storage), and user auth.
- Includes a private chat/messaging interface using Appwrite Realtime.

What We Built
- Auth flow: signup, login, logout, and session checks with Appwrite Account.
- Posts: create, edit, delete, list, and view single posts.
- Images: upload to Appwrite Storage, store file IDs on posts, preview in UI.
- Profiles: stored in Appwrite `profiles` collection for chat sidebar.
- Chat: 1:1 conversation UI with realtime create/delete updates.
- UI: Tailwind CSS v4, motion effects, cards, and componentized layouts.
- State: Redux Toolkit auth slice and persisted localStorage session data.

Project Layout (Key Files)
- src/main.jsx: router setup and app bootstrap.
- src/App.jsx: auth gate + layout shell.
- src/conf/conf.js: Appwrite env config wrapper.
- src/appwite/auth.js: Appwrite Account + profile creation + session helpers.
- src/appwite/configu.js: Appwrite Databases/Storage CRUD helpers.
- src/pages/Post.jsx: single post view and image rendering.
- src/components/post_form/Post_form.jsx: post creation/editing + image upload.
- src/components/containers/Chat.jsx: realtime chat UI.
- src/store/store.js and src/store/slicer.js: Redux auth state.

Routes
- /: Home feed
- /login, /signup: Auth pages
- /create-post: New post
- /edit-post/:slug: Edit post
- /post/:slug: Single post view
- /my-posts: User posts
- /posts: All posts
- /profile: Profile page
- /chat: Chat UI

Appwrite Data Model (Current Usage)
- Database: set via `VITE_APPWRITE_DATABASE_ID`
- Posts collection: set via `VITE_APPWRITE_COLLECTION_ID`
- Storage bucket: set via `VITE_APPWRITE_BUCKET_ID`
- Profiles collection: `profiles`
- Messages collection: `messages`
- Post fields used: `title`, `slug`, `content`, `images`, `status`, `userid`
- Message fields used: `content`, `sender_id`, `sender_name`, `receiver_id`
- Profile fields used: `name`, `userId`

Environment Variables
- VITE_APPWRITE_URL
- VITE_APPWRITE_PROJECT_ID
- VITE_APPWRITE_DATABASE_ID
- VITE_APPWRITE_COLLECTION_ID
- VITE_APPWRITE_BUCKET_ID
- VITE_TINYMCE_API_KEY

Tech Stack
- React 19
- Vite 7
- Tailwind CSS 4
- Appwrite SDK 21
- Redux Toolkit 2
- React Router 7
- React Hook Form 7
- TinyMCE React 6
- Framer Motion 12

Scripts
- npm run dev
- npm run build
- npm run preview
- npm run lint

Notes and Decisions
- Images are stored as file IDs in `images` and rendered using Appwrite file preview.
- Image upload uses public read permission to allow unauthenticated viewing.
- Auth state is cached in localStorage (`authStatus`, `userData`) and synced on app load.
- Chat uses Appwrite Realtime subscription on the messages collection.

Common Setup Checks
- Ensure Appwrite project, database, collections, and bucket IDs match `.env`.
- Ensure the `profiles` and `messages` collections exist with matching attribute names.
- If images do not render, verify bucket permissions or re-upload after permission changes.
