import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import authService from '../appwite/auth';
import { login, logout } from '../store/slicer';
import Header from './header/header';

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth status...');
        const user = await authService.getUser();
        console.log('User from auth service:', user);
        
        if (user && user.$id) {
          dispatch(login({ userData: user }));
          console.log('User logged in via session');
        } else {
          dispatch(logout());
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch(logout());
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (isCheckingAuth) return;
    
    const currentPath = location.pathname;
    console.log('Current path:', currentPath, 'Auth status:', authStatus);
    
const publicRoutes = ['/login', '/signup', '/post', '/posts']; 
const privateRoutes = ['/', '/create-post', '/edit-post', '/profile', '/my-posts'];
    const isPrivateRoute = privateRoutes.some(route => 
      currentPath === route || 
      (route === '/' && currentPath === '/') ||
      currentPath.startsWith(route + '/')
    );
    
    const isPublicRoute = publicRoutes.some(route => 
      currentPath === route || 
      currentPath.startsWith(route + '/')
    );
    
    if (!authStatus && isPrivateRoute) {
      console.log('Redirecting to login (not authenticated for private route)');
      navigate('/login');
    }
    
    if (authStatus && (currentPath === '/login' || currentPath === '/signup')) {
      console.log('Redirecting to home (already authenticated)');
      navigate('/');
    }
  }, [authStatus, navigate, location, isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-purple-900 to-violet-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
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