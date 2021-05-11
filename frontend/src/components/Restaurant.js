import React from 'react';

// import './Match.css';

const Restaurant = ({ restaurant }) => {
    return (
      <div className='match' >
        {restaurant.name}
      </div>
    );
  }
  
  export default Restaurant;