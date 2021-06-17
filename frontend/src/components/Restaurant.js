import React from 'react';
import RestaurantIcon from '@material-ui/icons/Restaurant';

import './Restaurant.css';

const Restaurant = ({ restaurant, setCurrent, setMenu }) => {
  const openMenu = () => {
    console.log('RESTAURANT', restaurant);
    setCurrent(restaurant);
    setMenu(true);
  }
  
    return (
      <div className='restaurant' onClick={openMenu} >
        <RestaurantIcon className='restaurant__image' fontSize='large' />
        <div className='restaurant__name' >
          <h2>{restaurant.name}</h2>
        </div>
      </div>
    );
  }
  
  export default Restaurant;