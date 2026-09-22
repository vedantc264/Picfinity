import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../store/user';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/user/login', { email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser({
          loggedIn: true,
          email: response.data.user?.email || email,
          user_id: response.data.user_id,
          name: response.data.user?.name || '',
          profileImage: '',
          saved: []
        });
        addToast('Welcome back to Picfinity!', 'success');
        navigate('/');
      } else {
        addToast(response.data.message || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      addToast(error.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@picfinity.com');
    setPassword('password123');
    addToast('Demo credentials filled!', 'info');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand-logo">
            Picfinity
          </Link>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage and collect inspiration.</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label">Password</label>
              <button
                type="button"
                className="btn-toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <button type="button" className="btn-demo-creds" onClick={handleFillDemo}>
            ⚡ Quick Fill Demo Credentials
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Create an account
            </Link>
          </p>
          <p style={{ marginTop: '6px' }}>
            <Link to="/" className="auth-link-muted">
              ← Back to Gallery
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;