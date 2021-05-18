import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';

import "./User.css";

const User = ({ user }) => {
  return (
    <div className='user' >
      <AccountCircleIcon className='user__image' fontSize='large' />
      <div className='user__name' >
          <h2>{user}</h2>
      </div>
    </div>
  );
}

export default User;