import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import './Upload.css';

const CATEGORIES = [
  'Nature',
  'Animals',
  'Cars',
  'Bikes',
  'Sports',
  'Art',
  'Design',
  'Crafts',
  'Food',
  'Quotes',
  'Tatoos',
  'Fashion',
  'Decor'
];

const UploadImageComponent = () => {
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Nature');
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        addToast('Please select a valid image file (PNG, JPG, WebP)', 'error');
        return;
      }
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith('image/')) {
      setFile(dropped);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(dropped);
    } else {
      addToast('Please drop a valid image file', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      addToast('Please log in first to upload photos', 'error');
      navigate('/login');
      return;
    }

    if (!title.trim()) {
      addToast('Please provide a title for your photo', 'error');
      return;
    }

    if (uploadMode === 'file' && !file) {
      addToast('Please select an image file to upload', 'error');
      return;
    }

    if (uploadMode === 'url' && !imageUrlInput.trim()) {
      addToast('Please enter an image URL', 'error');
      return;
    }

    setIsUploading(true);

    try {
      if (uploadMode === 'file') {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('category', category);

        const response = await api.post('/photo/upload-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.verified || response.data.photo) {
          addToast('Photo uploaded successfully!', 'success');
          navigate('/');
        } else {
          addToast(response.data.message || 'Upload failed', 'error');
        }
      } else {
        const response = await api.post('/photo/upload-photo', {
          title: title.trim(),
          description: description.trim(),
          category,
          imageUrl: imageUrlInput.trim()
        });

        if (response.data.verified || response.data.photo) {
          addToast('Photo added successfully!', 'success');
          navigate('/');
        } else {
          addToast(response.data.message || 'Upload failed', 'error');
        }
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      addToast(error.response?.data?.message || 'Error uploading photo', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-page-wrapper">
      <Navbar />

      <div className="upload-container">
        <div className="upload-card">
          <div className="upload-header">
            <h1 className="upload-title">Share Your Visual Masterpiece</h1>
            <p className="upload-subtitle">
              Upload local photos or link external imagery directly into Picfinity collections.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="mode-toggle">
            <button
              type="button"
              className={`mode-btn ${uploadMode === 'file' ? 'active' : ''}`}
              onClick={() => {
                setUploadMode('file');
                setPreviewUrl(file ? previewUrl : '');
              }}
            >
              📁 Local File Upload
            </button>
            <button
              type="button"
              className={`mode-btn ${uploadMode === 'url' ? 'active' : ''}`}
              onClick={() => {
                setUploadMode('url');
                setPreviewUrl(imageUrlInput);
              }}
            >
              🔗 Image URL / Web Link
            </button>
          </div>

          <form onSubmit={handleSubmit} className="upload-form">
            {/* Upload Area */}
            {uploadMode === 'file' ? (
              <div
                className="drop-zone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('photo-file-input').click()}
              >
                {previewUrl ? (
                  <div className="preview-container">
                    <img src={previewUrl} alt="Preview" className="preview-img" />
                    <span className="change-photo-badge">Click or drop to replace</span>
                  </div>
                ) : (
                  <div className="drop-placeholder">
                    <div className="drop-icon">📤</div>
                    <p className="drop-text">Drag & drop your image here, or browse files</p>
                    <span className="drop-hint">Supports PNG, JPG, WebP up to 15MB</span>
                  </div>
                )}
                <input
                  type="file"
                  id="photo-file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div className="url-input-section">
                <label className="form-label">Image Web URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrlInput}
                  onChange={(e) => {
                    setImageUrlInput(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  className="form-input"
                  required
                />
                {previewUrl && (
                  <div className="preview-container url-preview">
                    <img
                      src={previewUrl}
                      alt="URL Preview"
                      className="preview-img"
                      onError={() => addToast('Unable to load preview from URL', 'error')}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Metadata Fields */}
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                placeholder="e.g. Sunset over Alpine Peaks"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                placeholder="Describe your photograph, equipment, inspiration..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="btn-submit-upload"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading Photo...' : 'Publish to Gallery ✨'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadImageComponent;
