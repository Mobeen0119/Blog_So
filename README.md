BLOG_SO - Modern Blogging Platform

BlogSphere is a modern, feature-rich blogging platform built with React, Tailwind CSS, and Appwrite. Create, share, and discover amazing content with beautiful animations and intuitive design.

 Features

 Beautiful UI/UX
- Gradient animations on login/signup pages
- Smooth page transitions and hover effects
- Fully responsive design for all devices
- Modern dark theme with purple/violet gradients

 User Features
- Secure authentication with Appwrite
- Create, edit, and delete posts
- Rich text editor with TinyMCE
- Image upload and management
- User profile with post statistics
- Post status management (active/draft)

 Core Features
- View all community posts
- Personal posts feed
- Search and filter posts
- Social media ready
- Real-time updates

 Quick Start
Prerequisites
- Node.js 18 or higher
- Appwrite Cloud account
- Git

Installation

1. **Clone the repository**

git clone https://github.com/yourusername/blogsphere.git
Install dependencies


npm install
Set up environment variables
Create a .env file in the root directory:

env
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
VITE_TINYMCE_API_KEY=your_tinymce_api_key
Set up Appwrite

Create a new project in Appwrite Cloud

Set up a database with a posts collection

Create a storage bucket for images

Enable email/password authentication

Run the development server


npm run dev


Project Structure
text
src/
├── components/         # Reusable components
│   ├── Header.jsx     # Navigation header
│   ├── RTE.jsx        # Rich text editor
│   ├── Cards.jsx      # Post cards
│   └── index.jsx      # Component exports
├── pages/             # Page components
│   ├── Home.jsx       # Home page
│   ├── Login.jsx      # Login page
│   ├── Signup.jsx     # Signup page
│   ├── Profile.jsx    # User profile
│   ├── Create_post.jsx # Create post
│   ├── MyPosts.jsx    # User's posts
│   ├── AllPosts.jsx   # All community posts
│   ├── Post.jsx       # Single post view
│   └── EditPost.jsx   # Edit post
├── appwrite/          # Appwrite services
│   ├── auth.js        # Authentication
│   └── configu.js     # Database operations
├── store/             # Redux store
│   ├── store.js       # Redux setup
│   └── slicer.js      # Auth state
└── conf/              # Configuration

**Tech Stack**
Frontend: React 18 + Vite

Styling: Tailwind CSS v4

State Management: Redux Toolkit

Routing: React Router v6

Forms: React Hook Form

Backend: Appwrite Cloud

Text Editor: TinyMCE

Icons: React Icons

Key Dependencies
json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-redux": "^9.1.0",
  "react-router-dom": "^6.22.0",
  "react-hook-form": "^7.50.1",
  "@reduxjs/toolkit": "^2.2.0",
  "appwrite": "^14.0.0",
  "@tinymce/tinymce-react": "^4.4.0",
  "react-icons": "^5.0.1",
  "tailwindcss": "^4.0.0-alpha.6"
}
Configuration

Project uses Appwrite for:

User authentication

Database operations

File storage

Real-time updates

Environment Variables
All sensitive keys are stored in .env file and accessed via import.meta.env

Usage Guide
Creating a Post
Login to your account

Click "Create Post" in the header

Add title, content, and featured image

Click "Publish Post"

Managing Posts
View all posts: Click "All Posts"

View your posts: Click "My Posts"

Edit post: Click "Edit" on your post

Delete post: Click "Delete" on your post

User Profile
View your profile with:

Total posts count

Active posts count

Recent posts

Quick action buttons

Troubleshooting
Common Issues
Appwrite connection failed

Check your project ID in .env

Verify database/collection IDs

Ensure API key has correct permissions

Tailwind CSS not working

Make sure index.css imports Tailwind

Check postcss.config.js

Restart development server

Image upload failed

Check storage bucket permissions

Verify file size limits

Ensure CORS is configured

Authentication issues

Clear browser localStorage

Check Appwrite auth settings

Verify user exists in database

Debug Mode
Add debug logs in components:


The app is fully responsive:

Mobile: Stacked layout, hamburger menu

Tablet: Adjusted grid, optimized spacing

Desktop: Full navigation, side-by-side content

Security Features
Protected routes for authenticated users

Session management with localStorage

API keys stored in environment variables

Input validation with React Hook Form

XSS protection with TinyMCE sanitization


Tailwind CSS for styling

TinyMCE for rich text editor

React Icons for icons
