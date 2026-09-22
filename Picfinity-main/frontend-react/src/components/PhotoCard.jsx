import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../services/api';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const PhotoCard = ({ photo, isSavedInitial = false, isOwner = false, onDelete }) => {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      addToast('Please log in to save photos', 'error');
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post(
        '/photo/saveAPhoto',
        { photoId: photo.photoId || photo.id },
        {
          headers: {
            photo_id: photo.photoId || photo.id
          },
          params: { toggle: 'true' }
        }
      );

      if (response.data.saved === false) {
        setIsSaved(false);
        addToast('Removed from saved photos', 'info');
      } else if (response.data.saved || response.data.Api_Response === 321) {
        setIsSaved(true);
        addToast('Photo saved to your collection!', 'success');
      } else if (response.data.Api_Response === 323) {
        setIsSaved(true);
        addToast('Photo is already in your saved list', 'info');
      }
    } catch (error) {
      console.error('Error saving photo:', error);
      addToast('Could not update saved status', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(photo.photoId || photo.id);
    }
  };

  return (
    <div className="modern-photo-card">
      <Link to={`/photo/${photo.photoId || photo.id}`} className="photo-card-link">
        <div className="photo-image-wrapper">
          <img
            src={resolveImageUrl(photo.photo_url)}
            alt={photo.title || 'Picfinity photo'}
            className="photo-card-img"
            loading="lazy"
          />
          <div className="photo-card-overlay">
            <div className="overlay-top">
              <span className="category-tag">{photo.category || 'General'}</span>
              <div className="overlay-actions">
                {isOwner && (
                  <button
                    type="button"
                    className="action-btn delete-btn"
                    title="Delete Photo"
                    onClick={handleDeleteClick}
                  >
                    🗑️
                  </button>
                )}
                <button
                  type="button"
                  className={`action-btn save-btn ${isSaved ? 'saved' : ''}`}
                  onClick={handleSaveToggle}
                  disabled={saving}
                  title={isSaved ? 'Saved' : 'Save Photo'}
                >
                  {saving ? '⏳' : isSaved ? '★ Saved' : '☆ Save'}
                </button>
              </div>
            </div>

            <div className="overlay-bottom">
              <h3 className="photo-title">{photo.title || 'Untitled'}</h3>
              {photo.authorName && (
                <p className="photo-author">By {photo.authorName}</p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PhotoCard;
