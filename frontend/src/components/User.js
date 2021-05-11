import React from 'react';
import Avatar from '@material-ui/core/Avatar';

import "./User.css";

const User = ({ user }) => {
  return (
    <div className='user' >
        <Avatar className='user__image' alt={user} src={'https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84ZTBlMGY2ODRiYWJjNjFiMTYwZjc5OGU0OWVjMjU4Zj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.-uAnfLlSw7sO91rZ8yvqNb4DYqQRlJTi6hmS1o5eskQ'} />
        <div className='user__name' >
            <h2>{user}</h2>
        </div>
    </div>
  );
}

export default User;