import React from 'react';
import User from './User';

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