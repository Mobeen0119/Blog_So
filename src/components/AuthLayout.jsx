import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import authService from '../appwite/auth';
import { login, logout } from '../store/slicer';
import Header from './header/header.jsx';



export default function AuthLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);

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
      }
    };
    
    checkAuthStatus();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-violet-800">
      {authStatus && <Header />}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}