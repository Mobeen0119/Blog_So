import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './index.css'  // ← THIS LINE IS CRITICAL
import App from './App.jsx'
import { store } from './store/store.js'
import Home from './pages/Home.jsx'
import Login from './pages/login.jsx'
import EditPost from './pages/EditPost.jsx'
import Post from './pages/Post.jsx'
import Signup from './pages/Signup.jsx'
import Create_post from './pages/add_post.jsx'
import AllPosts from './pages/AllPosts.jsx'
import Profile from './pages/Profile.jsx'
import MyPosts from './pages/MyPosts.jsx'
import RootLayout from './components/RootLayout.jsx'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/create-post',
        element: <Create_post />
      },
      {
        path: '/edit-post/:slug',
        element: <EditPost />
      },
      {
        path: '/post/:slug',
        element: <Post />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/my-posts',
        element: <MyPosts />
      },
      {
        path: '/posts',
        element: <AllPosts />
      },
      {
        path: '*',
        element: <Home />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)