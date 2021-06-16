import React from 'react';
import Modal from 'react-bootstrap/Modal';
import PhoneIcon from '@material-ui/icons/Phone';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import StarsIcon from '@material-ui/icons/Stars';
import StarRatingComponent from 'react-star-rating-component';

import './Menu.css';

const Menu = (props) => {
  const {
    current,
    menu,
    closeMenu,
  } = props;
  
  return (
    <Modal show={menu} onHide={() => { closeMenu() }} >
      <Modal.Header closeButton >
        <Modal.Title>{current.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className='info' >
            <PhoneIcon />
            <a href={ 'tel:' + current.phone } >{current.display_phone}</a>
          </div>
          <div className='info' >
            <MonetizationOnIcon />
            <a>{current.price}</a>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <StarRatingComponent
         name='rating'
         value={current.rating}
         starColor='orange'
         editing={false}
        />
      </Modal.Footer>
    </Modal>
  );
}

export default Menu;