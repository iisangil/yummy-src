import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import { orange } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';

import "./Header.css";

const Header = ({ current }) => {
  return (
    <div className='header' >
      {current === 'room' ? (
        <Link to='/room' >
          <IconButton>
            <PeopleIcon
             style={{ color: orange[500] }}
             fontSize='large'
             className='header__icon'
            />
          </IconButton>
        </Link>
      ) : (
        <Link to='/room' >
          <IconButton>
            <PeopleIcon className='header__icon' />
          </IconButton>
        </Link>
      )}
      {current === 'main' ? (
        <Link to='/' >
          <IconButton>
            <RestaurantMenuIcon
             style={{ color: orange[500] }}
             fontSize='large'
            />
          </IconButton>
        </Link>
      ) : (
        <Link to='/' >
          <IconButton>
            <RestaurantMenuIcon />
          </IconButton>
        </Link>
      )}
      {current === 'matches' ? (
        <Link to='/matches' >
          <IconButton>
            <FavoriteIcon
             style={{ color: orange[500] }}
             fontSize='large'
             className='header__icon'
            />
          </IconButton>
        </Link>
      ) : (
        <Link to='/matches' >
          <IconButton>
            <FavoriteIcon className='header__icon' />
          </IconButton>
        </Link>
      )}


    </div>
  );
}

export default Header;