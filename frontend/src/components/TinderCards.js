import React from 'react';
import TinderCard from 'react-tinder-card'

import "./TinderCards.css";

const TinderCards = ({ restaurants, onLeave, begin }) => {
  const cards = restaurants.slice(begin+1);
  console.log(cards);
  return (
    <div className='cardContainer' >
      {cards.map((restaurant, index) => (
        <TinderCard className='swipe'
         key={restaurant.id}
         preventSwipe={['down', 'up']}
         onCardLeftScreen={(dir) => onLeave(dir, index+begin+1)}
        >
          <div className='card' style={{ backgroundImage: `url('${restaurant.image_url}')` }} >
            <h3>{restaurant.name}</h3>
          </div>
        </TinderCard>
      )).reverse()}
    </div>
  );
}

export default TinderCards;