import React from 'react'
import "./Button.css"
const Button = ({photo}) => {
  return (
    <>
      <div className='b_for-overlay-effect'>
        <img src={photo} alt="" />
          <button type='button' className='b_save-button'>save</button>
      </div>
    </>
  )
}

export default Button