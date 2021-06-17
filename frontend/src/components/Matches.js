import React, { useState } from 'react';
import Restaurant from './Restaurant';
import Menu from './Menu';

const Matches = ({ matches, restaurants }) => {
  const [menu, setMenu] = useState(false);
  const [current, setCurrent] = useState(restaurants[0]);

  const closeMenu = () => {
    setMenu(false);
  }

  return (
    <div className='room' >
      {matches.map((index) =>
        <Restaurant
         key={index}
         restaurant={restaurants[index]}
         setCurrent={setCurrent}
         setMenu={setMenu}
        />
      )}
      <Menu
       current={current}
       menu={menu}
       closeMenu={closeMenu}
      />
    </div>
  );
}

export default Matches;