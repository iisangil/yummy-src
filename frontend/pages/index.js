import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
// import firebaseConfig from '../constants/firebaseConfig';
// import * as firebase from 'firebase/app';
// import 'firebase/auth';


export default function Home() {
  // const [status, setStatus] = useState(false);

  // useEffect(() => {

  // })

  return (
    <div>
      <Head>
        <title>Yummy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to Yummy!
        </h1>

        <Link href="/signin">
          <a>SIGN IN</a>
        </Link>
      </main>
    </div>
  )
}
