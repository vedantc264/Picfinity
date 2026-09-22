import React from 'react'
import { Route , Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Category from './Category';
import Upload from './Upload';
import Profile from './Profile';
import Photo from './Photo';
const Dashboard = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/photo/:photoId" element={<Photo />} />
      </Routes>
    </div>
  )
}

export default Dashboard