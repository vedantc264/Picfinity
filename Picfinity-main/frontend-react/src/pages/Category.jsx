import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import PhotoCard from '../components/PhotoCard';
import api from '../services/api';
import './Home.css';

const Category = () => {
  const { category } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true);
        const response = await api.get('/photo/getPhotosByCategory', {
          headers: { category }
        });
        if (response.data.photos) {
          setPhotos(response.data.photos);
        } else {
          setPhotos([]);
        }
      } catch (error) {
        console.error('Error fetching category photos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, [category]);

  return (
    <div className="home-page-container">
      <Navbar />

      <section className="hero-banner" style={{ padding: '40px 24px 20px' }}>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-gradient">{category}</span> Photography
          </h1>
          <p className="hero-subtitle">
            Curated high-resolution imagery tagged under {category}.
          </p>
        </div>
      </section>

      <Slider activeCategory={category} />

      <main className="gallery-section">
        <div className="gallery-header">
          <h2 className="section-title">
            {category} Gallery
            <span className="photo-count-badge">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </span>
          </h2>
          <Link to="/" style={{ color: '#a855f7', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
            ← Back to All
          </Link>
        </div>

        {loading ? (
          <div className="masonry-loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="photo-skeleton-card"></div>
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon">📂</div>
            <h3>No photos found in {category}</h3>
            <p>Be the first to upload an image in this category!</p>
            <Link to="/upload" className="btn-reset-filters" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Upload to {category}
            </Link>
          </div>
        ) : (
          <div className="masonry-gallery-grid">
            {photos.map((photo) => (
              <PhotoCard key={photo.photoId || photo.id} photo={photo} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Category;