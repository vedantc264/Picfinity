import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../store/user';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({ loggedIn: false, email: '', user_id: -1, name: '', profileImage: '', saved: [] });
    addToast('Logged out successfully', 'info');
    navigate('/');
  };

  return (
    <header className="modern-navbar">
      <div className="nav-container">
        <Link to="/" className="brand-logo">
          <span className="brand-text-gradient">Picfinity</span>
          <span className="brand-badge">PRO</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            Explore
          </Link>
          <Link to="/upload" className={`nav-item ${location.pathname === '/upload' ? 'active' : ''}`}>
            Upload
          </Link>
        </nav>

        <div className="nav-actions">
          {user.loggedIn ? (
            <div className="user-profile-menu">
              <Link to="/upload" className="btn-glow-upload">
                <span>+</span> Upload Image
              </Link>
              <div className="avatar-dropdown-wrapper">
                <button
                  type="button"
                  className="user-avatar-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </button>
                {menuOpen && (
                  <div className="avatar-dropdown">
                    <div className="dropdown-user-info">
                      <p className="user-info-name">{user.name || 'User'}</p>
                      <p className="user-info-email">{user.email}</p>
                    </div>
                    <hr className="dropdown-divider" />
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      👤 My Profile & Saved
                    </Link>
                    <Link
                      to="/upload"
                      className="dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      🚀 Upload Photo
                    </Link>
                    <hr className="dropdown-divider" />
                    <button
                      type="button"
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      🚪 Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-ghost">
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary-gradient">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;