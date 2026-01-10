import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Logo } from '../index.jsx'
import authService from '../../appwite/auth';
import { logout } from '../../store/slicer';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!authStatus) {
    return null;
  }

  const navItems = [
    { name: 'Home', slug: '/' },
    { name: 'Profile', slug: '/profile' },
    { name: 'Create Post', slug: '/create-post' },
    { name: 'My Posts', slug: '/my-posts' },
    { name: 'All Posts', slug: '/posts' },
  ];

  return (
    <header className="w-full border-b border-white/20 bg-linear-to-r from-gray-900 via-purple-900 to-violet-800 shadow-lg">
      <Container>
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="transition-all duration-500 hover:scale-110">
              <Logo width="80px" />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.slug}
                className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}
            
            <button
              onClick={logoutHandler}
              className="px-4 py-2 rounded-lg bg-linear-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Header;