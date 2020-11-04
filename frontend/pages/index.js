import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import auth from '../config/firebase';
// import firebaseConfig from '../constants/firebaseConfig';
// import * as firebase from 'firebase/app';
// import 'firebase/auth';

// get firebase login status
const useUser = () => ({ user: null })

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((result) => {
      if (result) {
        user = result;
      } else {
        user = null;
      }
    })
  }, [user])

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
