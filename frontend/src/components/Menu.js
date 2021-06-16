import React from 'react';
import Modal from 'react-bootstrap/Modal';

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
    </Modal>
  );
}

export default Menu;