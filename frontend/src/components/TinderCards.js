import React, { useState } from 'react';
import TinderCard from 'react-tinder-card'

import SwipeButtons from './SwipeButtons';
import Menu from './Menu';

import './TinderCards.css';

const TinderCards = ({ restaurants, onLeave, begin }) => {
  const [menu, setMenu] = useState(false);
  const [button, setButton] = useState(false);

  const cards = restaurants.slice(begin+1);
  const cardRefs = cards.map(() => React.createRef());

  const [current, setCurrent] = useState(cards[0])

  const cardSwipe = (dir, index) => {
    if (cards.length === 1) {
      setCurrent({
        name: 'null',
        phone: '0000000000',
        display_phone: '(000) 000-0000',
        price: 'n/a',
        rating: '0',
      });
    } else {
      console.log('BUTTON', button);
      if (!button) {
        console.log('SWIPE CARDS', cards, index);
        setCurrent(cards[index+1])
      }
    }
    onLeave(dir, index);
  }

  const buttonSwipe = (dir) => {
    if (cards.length) {
      setButton(true);
      cardRefs[0].current.swipe(dir);
      if (cards.length === 1) {
        setCurrent({
          name: 'null',
          phone: '0000000000',
          display_phone: '(000) 000-0000',
          price: 'n/a',
          rating: '0',
        });
      } else {
        console.log('BUTTON CARDS', cards);
        setCurrent(cards[1]);
      }

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
         onCardLeftScreen={(dir) => cardSwipe(dir, index+begin+1)}
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
