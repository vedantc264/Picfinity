import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../store/user';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import './Login.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/user/signup', {
        name: name.trim(),
        email: email.trim(),
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser({
          loggedIn: true,
          email: response.data.user?.email || email,
          user_id: response.data.user_id,
          name: response.data.user?.name || name,
          profileImage: '',
          saved: []
        });
        addToast('Account created successfully! Welcome to Picfinity.', 'success');
        navigate('/');
      } else {
        addToast(response.data.message || 'Signup failed', 'error');
      }
    } catch (error) {
      console.error('Signup error:', error);
      addToast(error.response?.data?.message || 'Error creating account', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand-logo">
            Picfinity
          </Link>
          <h2 className="auth-title">Create an Account</h2>
          <p className="auth-subtitle">Join thousands of creators showcasing their vision.</p>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              placeholder="Alex Rivers"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="alex@example.com"
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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started Free'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
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

export default Signup;
