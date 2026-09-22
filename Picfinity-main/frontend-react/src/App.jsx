import { useState } from 'react'
import './App.css'
import Home from './pages/Home';
import InitUser from './InitUser';
import Slider from './components/Slider';
function  App() {

  return (
    <div>
      <InitUser></InitUser>
      {/* <Slider></Slider> */}
    </div>
  )
}

export default App
