import React from 'react';

import './SignIn.css';

const SignIn = (props) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
    handleSignup,
    hasAccount,
    setHas,
    emailErr,
    passErr,
    name,
    setName,
    clearInputs,
    clearErrors,
  } = props;

  const changeHas = () => {
    clearInputs();
    clearErrors();
    setHas(!hasAccount);
  }

  return (
    <div className='signIn' >
      <h2>Yummy</h2>
      {hasAccount ? (
        <h4>Log In</h4>
      ) : (
        <div>
          <h4>Register</h4>
          <label>Username</label>
          <input
           className='signIn__input'
           type='text'
           required
           value={name}
           onChange={(e) => setName(e.target.value)}
          />
        </div>
      )
      }
      <label>Email</label>
      <input
       className='signIn__input'
       type='text'
       autoFocus
       required
       value={email}
       onChange={(e) => setEmail(e.target.value)}
      />
      <p className='signIn__p' >{emailErr}</p>
      <label>Password</label>
      <input
       className='signIn__input'
       type='password'
       required
       value={password}
       onChange={(e) => setPassword(e.target.value)}
      />
      <p className='signIn__p' >{passErr}</p>
      <div>
        {hasAccount ? (
          <div>
          <button className='signIn__button' onClick={handleSignIn} >Sign In</button>
          <p className='signIn__p' >Don't have an account? <span className='signIn__span' onClick={changeHas} ><u>Sign Up</u></span></p>
          </div>
        ) : (
          <div>
          <button className='signIn__button' onClick={handleSignup} >Sign Up</button>
          <p className='signIn__p' >Have an account? <span className='signIn__span' onClick={changeHas} ><u>Sign In</u></span></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignIn;