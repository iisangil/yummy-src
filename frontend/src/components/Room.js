import React from 'react';
import User from './User';

import "./Room.css";

const Room = ({ users }) => {
  return (
    <div className='room' >
      {users.map((user) =>
        <User key={user} user={user} />
      )}
    </div>
  );
}

export default Room;