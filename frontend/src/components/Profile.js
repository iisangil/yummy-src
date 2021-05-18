import React, { useState } from 'react'
import { IconButton } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import './Profile.css';

const Profile = ({ display, handleLogout }) => {
  const [open, setOpen] = useState(false);

  return (
  <div className='profile' >
    <div className='profile__button' >
      <p>Welcome, {display}</p>
      <IconButton onClick={() => {setOpen(!open)}} >
        <PersonIcon fontSize='large' />
      </IconButton>
    </div>
    {open &&
    <div className='profile__button' >
      <p>Log Out?</p>
      <IconButton onClick={handleLogout} >
        <ExitToAppIcon fontSize='large' />
      </IconButton>
    </div>}
  </div>
  )
}

export default Profile;
