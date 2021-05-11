import React from 'react';
import Restaurant from './Restaurant';

// import "./Matches.css";

const Matches = ({ matches, restaurants }) => {
  return (
    <div className='room' >
      {matches.map((index) =>
        <Restaurant
         key={index}
         restaurant={restaurants[index]}
        />
      )}
    </div>
  );
}

export default Matches;