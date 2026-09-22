import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './Slider.css';

const CATEGORY_ICONS = {
  Nature: '🌲',
  Animals: '🦁',
  Cars: '🏎️',
  Bikes: '🏍️',
  Sports: '⚽',
  Art: '🎨',
  Design: '📐',
  Crafts: '🧶',
  Food: '🍕',
  Quotes: '💬',
  Tatoos: '🖋️',
  Fashion: '👗',
  Decor: '🛋️'
};

const Slider = ({ onSelectCategory, activeCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { category: currentParamCategory } = useParams();

  const selected = activeCategory || currentParamCategory || 'All';

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get('/photo/getAllCategories');
        if (response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(['Nature', 'Animals', 'Cars', 'Bikes', 'Sports', 'Art', 'Design', 'Crafts', 'Food', 'Decor']);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      if (category === 'All') {
        navigate('/');
      } else {
        navigate(`/category/${category}`);
      }
    }
  };

  return (
    <div className="category-slider-wrapper">
      <button
        type="button"
        className="slider-arrow left"
        onClick={() => handleScroll('left')}
        aria-label="Scroll left"
      >
        ‹
      </button>

      <div className="category-scroll-container" ref={scrollContainerRef}>
        <button
          type="button"
          className={`category-pill ${selected === 'All' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('All')}
        >
          <span className="pill-icon">✨</span>
          <span className="pill-label">All</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-pill ${selected.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            <span className="pill-icon">{CATEGORY_ICONS[cat] || '🏷️'}</span>
            <span className="pill-label">{cat}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="slider-arrow right"
        onClick={() => handleScroll('right')}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
};

export default Slider;
