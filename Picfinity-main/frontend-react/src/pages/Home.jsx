import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import "./Home.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import handleButtonOnClick from '../components/handleButtonOnClick'
import { loggedInSelector } from '../store/user'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Slider from '../components/Slider'
import { photoState } from '../store/photo'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SERVER_BASE = API_BASE.replace(/\/api\/?$/, '');

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${SERVER_BASE}${url.startsWith('/') ? url : '/' + url}`;
};

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const loggedIn = useRecoilValue(loggedInSelector);
  const navigate = useNavigate();
  const photoS = useRecoilValue(photoState);
  const setPhotoS = useSetRecoilState(photoState);

  useEffect(() => {
    async function getAllPhotos() {
      try {
        const response = await axios.get(`${API_BASE}/photo/getAllPhotosUnprotected`);
        if (response.data.photos) {
          const ph = response.data.photos;
          let p = [];
          for (var i = response.data.photos.length - 1; i >= 0; i--) {
            p.push(ph[i]);
          }
          setPhotos(p);
        }
      } catch (err) {
        console.error('Error fetching photos:', err);
      }
    }
    getAllPhotos();
  }, []);

  useEffect(() => {
    setPhotoS(photos);
  }, [photos]);

  useEffect(() => {
    async function getAllCategories() {
      try {
        const response = await axios.get(`${API_BASE}/photo/getAllCategories`);
        if (response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    getAllCategories();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div className="heading-on-homepage"><h1>Find a category</h1></div>
      <Slider></Slider>
      <div className="h_message"><h4>Explore</h4></div>
      <div className='homepage-photo-gallery'>
        <div className='homepage-photo-grid' id='homepage-photo-grid'>
          {photos ? photos.map((photo) => {
            const id = photo.photoId || photo.id;
            return (
              <div className='photo-of-photo-gallery' key={id}>
                <div className='for-overlay-effect'>
                  <img src={resolveImageUrl(photo.photo_url)} alt=""/>
                  <button type='button' className='save-button' onClick={() => handleButtonOnClick(id, loggedIn, localStorage.getItem('token'))}>save</button>
                  <Link to={`/photo/${id}`}><div className='photo-overlay'></div></Link>
                </div>
              </div>
            )
          }) : <></>}
        </div>
      </div>
    </>
  )
}

export default Home;