import React from 'react';
import Modal from 'react-bootstrap/Modal';
import IconButton from '@material-ui/core/IconButton';
import PhoneIcon from '@material-ui/icons/Phone';

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
          <IconButton href={ 'tel:' + current.phone } >
            <PhoneIcon />
          </IconButton>
          {current.display_phone}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Menu;