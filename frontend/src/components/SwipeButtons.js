import React from 'react';
import { IconButton } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import "./SwipeButtons.css";

const SwipeButtons = (props) => {
  const { swipe } = props;

  return (
    <div className='swipeButtons' >
      <IconButton onClick={() => { swipe('left') }} >
        <ThumbDownIcon className='swipeButtons__dislike' fontSize='large' />
      </IconButton>
      <IconButton>
        <MenuBookIcon className='swipeButtons__menu' fontSize='large' />
      </IconButton>
      <IconButton onClick={() => { swipe('right') }}>
        <ThumbUpIcon className='swipeButtons__like' fontSize='large' />
      </IconButton>
    </div>
  );
}

export default SwipeButtons;