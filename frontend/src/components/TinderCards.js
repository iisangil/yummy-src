import React from 'react';
import TinderCard from 'react-tinder-card'

import SwipeButtons from './SwipeButtons';

import "./TinderCards.css";

const TinderCards = ({ restaurants, onLeave, begin }) => {
  const cards = restaurants.slice(begin+1);
  console.log('CARDS', cards);

  const cardRefs = cards.map(() => React.createRef());

  const removedCards = [];

  const buttonSwipe = (dir) => {
    const cardsLeft = cards.filter(restaurant => !removedCards.includes(restaurant));
    console.log('CARDSLEFT', cardsLeft);
    if (cardsLeft.length) {
      const swipeCard = cardsLeft[0];
      console.log('SWIPECARD', swipeCard);
      const swipeIndex = cards.map(restaurant => restaurant.id).indexOf(swipeCard.id);
      console.log('SWIPEINDEX', swipeIndex);
      cardRefs[swipeIndex].current.swipe(dir);
    }
  }

  const removeLeave = (dir, index, restaurant) => {
    removedCards.push(restaurant);
    console.log('REMOVED', removedCards);
    onLeave(dir, index);
  }
  
  return (
    <div className='cardContainer' >
      {cards.map((restaurant, index) => (
        <TinderCard
         ref={cardRefs[index]}
         className='swipe'
         key={restaurant.id}
         preventSwipe={['down', 'up']}
         onCardLeftScreen={(dir) => removeLeave(dir, index+begin+1, restaurant)}
        >
          <div className='card' style={{ backgroundImage: `url('${restaurant.image_url}')` }} >
            <h3>{restaurant.name}</h3>
          </div>
        </TinderCard>
      )).reverse()}
      <SwipeButtons swipe={buttonSwipe} />
    </div>
  );
}

export default TinderCards;