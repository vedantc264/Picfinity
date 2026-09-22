import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import PhotoCard from '../components/PhotoCard';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true);
        const response = await api.get('/photo/getAllPhotosUnprotected');
        if (response.data.photos) {
          setPhotos(response.data.photos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesSearch =
        !searchQuery ||
        photo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        photo.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [photos, searchQuery, selectedCategory]);

  return (
    <div className="home-page-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Discover & Share <span className="text-gradient">Infinite Visuals</span>
          </h1>
          <p className="hero-subtitle">
            Explore thousands of curated, high-resolution photographs, designs, and artworks.
          </p>

          <div className="hero-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title, description, or category (e.g. Nature, Cars)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Pills Slider */}
      <Slider
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Photo Gallery Grid */}
      <main className="gallery-section">
        <div className="gallery-header">
          <h2 className="section-title">
            {selectedCategory === 'All' ? 'Trending Photography' : `${selectedCategory} Collection`}
            <span className="photo-count-badge">
              {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="masonry-loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="photo-skeleton-card"></div>
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon">📷</div>
            <h3>No photos found</h3>
            <p>Try searching for a different keyword or selecting another category.</p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="masonry-gallery-grid">
            {filteredPhotos.map((photo) => (
              <PhotoCard key={photo.photoId || photo.id} photo={photo} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;