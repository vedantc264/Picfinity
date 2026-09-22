import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api, { resolveImageUrl } from '../services/api';
import { useToast } from '../context/ToastContext';
import './Photo.css';

const Photo = () => {
  const { photoId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadPhoto() {
      setLoading(true);
      try {
        const response = await api.get('/photo/getAllPhotosUnprotected');
        if (response.data.photos) {
          const found = response.data.photos.find(
            (p) => String(p.photoId || p.id) === String(photoId)
          );
          if (found) {
            setPhoto(found);
          } else {
            addToast('Photo not found', 'error');
          }
        }
      } catch (err) {
        console.error('Error loading photo:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPhoto();
  }, [photoId]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      addToast('Please log in to save photos', 'info');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(
        '/photo/saveAPhoto',
        { photoId: photo.photoId || photo.id },
        {
          headers: { photo_id: photo.photoId || photo.id },
          params: { toggle: 'true' }
        }
      );

      if (response.data.saved === false) {
        setIsSaved(false);
        addToast('Removed from saved photos', 'info');
      } else {
        setIsSaved(true);
        addToast('Photo saved to your collection!', 'success');
      }
    } catch (err) {
      addToast('Error saving photo', 'error');
    }
  };

  const handleDownload = () => {
    if (!photo) return;
    const url = resolveImageUrl(photo.photo_url);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${photo.title || 'photo'}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Opening image download...', 'info');
  };

  return (
    <div className="photo-detail-page">
      <Navbar />

      <div className="photo-detail-container">
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {loading ? (
          <div className="photo-detail-skeleton"></div>
        ) : photo ? (
          <div className="photo-detail-layout">
            <div className="photo-stage">
              <img
                src={resolveImageUrl(photo.photo_url)}
                alt={photo.title}
                className="photo-main-img"
              />
            </div>

            <div className="photo-sidebar-card">
              <div className="sidebar-top">
                <Link to={`/category/${photo.category}`} className="photo-category-link">
                  🏷️ {photo.category}
                </Link>
                <h1 className="photo-main-title">{photo.title}</h1>

                {photo.authorName && (
                  <div className="author-row">
                    <div className="author-avatar">{photo.authorName[0].toUpperCase()}</div>
                    <div>
                      <p className="author-label">Photographer</p>
                      <p className="author-name">{photo.authorName}</p>
                    </div>
                  </div>
                )}
              </div>

              {photo.description && (
                <div className="photo-desc-box">
                  <h3 className="desc-title">About this photograph</h3>
                  <p className="desc-text">{photo.description}</p>
                </div>
              )}

              <div className="action-buttons-group">
                <button
                  type="button"
                  className={`btn-action-primary ${isSaved ? 'saved' : ''}`}
                  onClick={handleSave}
                >
                  {isSaved ? '★ Saved to Collection' : '☆ Save to Collection'}
                </button>

                <button
                  type="button"
                  className="btn-action-secondary"
                  onClick={handleDownload}
                >
                  ⬇️ Download Image
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state-box">
            <h3>Photo Not Found</h3>
            <p>The photo you are looking for does not exist or has been removed.</p>
            <Link to="/" className="btn-reset-filters" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Return to Gallery
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photo;