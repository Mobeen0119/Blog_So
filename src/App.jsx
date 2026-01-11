import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import authService from './appwite/auth';
import { login, logout } from './store/slicer';
import Header from './components/header/header';

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await authService.getUser();
        if (user) {
          dispatch(login({ userData: user }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.log('Auth check error:', error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;
    
    const currentPath = window.location.pathname;
    const publicRoutes = ['/login', '/signup'];
    const privateRoutes = ['/', '/profile', '/create-post', '/my-posts', '/edit-post'];

    if (!authStatus && privateRoutes.some(route => 
        currentPath === route || 
        (route === '/' && currentPath === '/') ||
        (route.includes('edit-post') && currentPath.includes('edit-post'))
    )) {
      navigate('/login');
    }
    
    if (authStatus && publicRoutes.includes(currentPath)) {
      navigate('/');
    }
  }, [authStatus, navigate, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-purple-900 to-violet-800">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-violet-800">
      {authStatus && <Header />}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}