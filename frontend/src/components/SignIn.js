import { React } from 'react';

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
    setName
  } = props;
  return (
    <section>
      <div>
        {!hasAccount && 
        <div>
          <label>Name</label>
          <input
          type='text'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
        </div>}
        <label>Email</label>
        <input
        type='text'
        autoFocus
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <p>{emailErr}</p>
        <label>Password</label>
        <input
        type='password'
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <p>{passErr}</p>
        <div>
          {hasAccount ? (
            <div>
            <button onClick={handleSignIn} >Sign In</button>
            <p>Don't have an account? <span onClick={() => setHas(!hasAccount)} >Sign Up</span></p>
            </div>
          ) : (
            <div>
            <button onClick={handleSignup} >Sign Up</button>
            <p>Have an account? <span onClick={() => setHas(!hasAccount)} >Sign In</span></p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SignIn;