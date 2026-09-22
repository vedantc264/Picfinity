import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../store/user';
import Navbar from '../components/Navbar';
import PhotoCard from '../components/PhotoCard';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useRecoilState(userState);
  const [activeTab, setActiveTab] = useState('uploads'); // 'uploads' or 'saved'
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ uploads: 0, saved: 0 });

  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      addToast('Please log in to view your profile', 'info');
      navigate('/login');
      return;
    }

    async function loadStats() {
      try {
        const [upRes, savRes] = await Promise.all([
          api.get('/photo/getAllUploadedPhotos'),
          api.get('/photo/getAllSavedPhoto')
        ]);
        setStats({
          uploads: upRes.data.photos ? upRes.data.photos.length : 0,
          saved: savRes.data.photos ? savRes.data.photos.length : 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }
    loadStats();
  }, [navigate]);

  useEffect(() => {
    async function fetchTabData() {
      setLoading(true);
      try {
        if (activeTab === 'uploads') {
          const response = await api.get('/photo/getAllUploadedPhotos');
          setPhotos(response.data.photos || []);
        } else {
          const response = await api.get('/photo/getAllSavedPhoto');
          setPhotos(response.data.photos || []);
        }
      } catch (error) {
        console.error('Error loading tab photos:', error);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTabData();
  }, [activeTab]);

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to permanently delete this photo?')) {
      return;
    }

    try {
      const response = await api.delete('/photo/deleteAPhoto', {
        headers: { photo_id: photoId }
      });

      if (response.data.deleted || response.data.Api_Response === 321) {
        setPhotos((prev) => prev.filter((p) => (p.photoId || p.id) !== photoId));
        setStats((prev) => ({ ...prev, uploads: Math.max(0, prev.uploads - 1) }));
        addToast('Photo deleted successfully', 'success');
      } else {
        addToast(response.data.message || 'Could not delete photo', 'error');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      addToast('Failed to delete photo', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({ loggedIn: false, email: '', user_id: -1, name: '', profileImage: '', saved: [] });
    addToast('Logged out successfully', 'info');
    navigate('/');
  };

  return (
    <div className="profile-page-wrapper">
      <Navbar />

      <div className="profile-container">
        {/* Profile Card Header */}
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          <div className="profile-details">
            <h1 className="profile-name">{user.name || 'Creative Member'}</h1>
            <p className="profile-email">{user.email || 'user@picfinity.com'}</p>

            <div className="profile-stats-row">
              <div className="stat-item">
                <span className="stat-number">{stats.uploads}</span>
                <span className="stat-label">Uploads</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{stats.saved}</span>
                <span className="stat-label">Saved Photos</span>
              </div>
            </div>
          </div>

          <div className="profile-actions-top">
            <button type="button" className="btn-logout" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="profile-tabs">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'uploads' ? 'active' : ''}`}
            onClick={() => setActiveTab('uploads')}
          >
            📸 My Uploads ({stats.uploads})
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            ⭐ Saved Collection ({stats.saved})
          </button>
        </div>

        {/* Photo Content */}
        <main className="profile-gallery-section">
          {loading ? (
            <div className="masonry-loading-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="photo-skeleton-card"></div>
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-icon">{activeTab === 'uploads' ? '📷' : '🔖'}</div>
              <h3>{activeTab === 'uploads' ? 'No uploads yet' : 'No saved photos'}</h3>
              <p>
                {activeTab === 'uploads'
                  ? 'Start sharing your photos with the Picfinity creative community.'
                  : 'Click the Save button on any photo in the gallery to bookmark it here.'}
              </p>
              {activeTab === 'uploads' ? (
                <Link to="/upload" className="btn-reset-filters" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  Upload Your First Photo
                </Link>
              ) : (
                <Link to="/" className="btn-reset-filters" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  Explore Gallery
                </Link>
              )}
            </div>
          ) : (
            <div className="masonry-gallery-grid">
              {photos.map((photo) => (
                <PhotoCard
                  key={photo.photoId || photo.id}
                  photo={photo}
                  isOwner={activeTab === 'uploads'}
                  isSavedInitial={activeTab === 'saved'}
                  onDelete={handleDeletePhoto}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;