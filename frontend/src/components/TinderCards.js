import React, { useState } from 'react';
import TinderCard from 'react-tinder-card'

import SwipeButtons from './SwipeButtons';
import Menu from './Menu';

import './TinderCards.css';

const TinderCards = ({ restaurants, onLeave, begin }) => {
  const [menu, setMenu] = useState(false);

  const cards = restaurants.slice(begin+1);
  const cardRefs = cards.map(() => React.createRef());

  const [current, setCurrent] = useState(cards[0])

  const buttonSwipe = (dir) => {
    if (cards.length) {
      cardRefs[0].current.swipe(dir);
    }
  }

  const showMenu = () => {    
    setMenu(true);
    console.log('CURRENT', current);

  }

  const closeMenu = () => {
    setMenu(false);
  }
  
  return (
    <div className='cardContainer' >
      {cards.map((restaurant, index) => (
        <TinderCard
         ref={cardRefs[index]}
         className='swipe'
         key={restaurant.id}
         preventSwipe={['down', 'up']}
         onCardLeftScreen={(dir) => onLeave(dir, index+begin+1)}
        >
          <div className='card' style={{ backgroundImage: `url('${restaurant.image_url}')` }} >
            <h3>{restaurant.name}</h3>
          </div>
        </TinderCard>
      )).reverse()}
      <Menu
       current={current}
       menu={menu}
       closeMenu={closeMenu}
      />
      <SwipeButtons
       swipe={buttonSwipe}
       showMenu={showMenu}
      />
    </div>
  );
}

export default TinderCards;