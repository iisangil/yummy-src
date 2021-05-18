import React from 'react';
import { IconButton } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import "./SwipeButtons.css";

const SwipeButtons = () => {
  return (
    <div className='swipeButtons' >
      <IconButton>
        <ThumbDownIcon className='swipeButtons__dislike' fontSize='large' />
      </IconButton>
      <IconButton>
        <MenuBookIcon className='swipeButtons__menu' fontSize='large' />
      </IconButton>
      <IconButton>
        <ThumbUpIcon className='swipeButtons__like' fontSize='large' />
      </IconButton>
    </div>
  );
}

export default SwipeButtons;