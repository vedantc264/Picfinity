import React from 'react'
import "./Navbar.css"
import { loggedInSelector } from '../store/user'
import { useRecoilValue } from 'recoil'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const loggedIn = useRecoilValue(loggedInSelector);
  const navigate = useNavigate();

  if (loggedIn) {
    return (
      <div className="nav-bar">
        <div className="nav-logo">
          <Link to={"/"}>
            <img width="200px" src='/images/PicfinityLogo2.png' alt="Picfinity Logo" onClick={() => {
              navigate("/")
            }} />
          </Link>
        </div>
        <div className="nav-ops">
          <Link to={"/upload"} style={{ textDecoration: 'none' }}>
            <button type="button" className="btn btn-warning upload" id="homebtn2"><span className="first-span">Upload </span> <span> Image</span></button>
          </Link>
          <Link to={"/profile"} style={{ textDecoration: 'none' }}>
            <button type="button" className="btn btn-warning" id="homebtn">Profile</button>
          </Link>
        </div>
      </div>
    )
  } else {
    return (
      <div className="nav-bar">
        <div className="nav-logo">
          <Link to={"/"}>
            <img width="200px" src='/images/PicfinityLogo2.png' alt="Logo" />
          </Link>
        </div>
        <div className="nav-ops">
          <Link to={"/login"} style={{ textDecoration: 'none' }}>
            <button type="button" className="btn btn-warning" id="homebtn">Login</button>
          </Link>
          <Link to={"/signup"} style={{ textDecoration: 'none' }}>
            <button type="button" className="btn btn-warning" id="homebtn">Sign Up</button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Navbar;