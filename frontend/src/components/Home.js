import React, { useState } from 'react'
import Profile from './Profile';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './Home.css';

const Home = ({ display, handleLogout, code, setCode, createRoom, joinRoom }) => {
  const [create, setCreate] = useState(false);
  const [join, setJoin] = useState(false);

  const handleClose = (type) => {
    if (type === 'create') {
      setCreate(false);
    } else {
      setCode('');
      setJoin(false);
    }
  }

  const handleShow = (type) => {
    if (create === join) {
      if (type === 'create') {
        setCreate(true);
      } else {
        setJoin(true);
      }
    }
  }

  return (
    <div className='home' >
      <h2>Yummy</h2>
      <div className='home__dropDown' >
        <Profile display={display} handleLogout={handleLogout} />
      </div>
      <div className='home__roomButtons' >
        <button className='home__button' onClick={() => {handleShow('create')}}>Create a Room</button>
        <Modal show={create} onHide={() => {handleClose('create')}}>
          <Modal.Header closeButton>
            <Modal.Title>Create a Room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Hi
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={createRoom} >Create</Button>
          </Modal.Footer>
        </Modal>        
        <button className='home__button' onClick={() => {handleShow('join')}} >Join a Room</button>
        <Modal show={join} onHide={() => {handleClose('join')}}>
          <Modal.Header closeButton>
            <Modal.Title>Join a Room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Hi again
          </Modal.Body>
          <Modal.Footer>
            <input
             type='text'
             required
             autoFocus
             value={code}
             onChange={(e) => {setCode(e.target.value)}}
            />
            <Button onClick={joinRoom} >Join</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default Home;
