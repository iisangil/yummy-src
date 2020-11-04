import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import firebase from '../config/firebase';
// import firebaseConfig from '../constants/firebaseConfig';
// import * as firebase from 'firebase/app';
// import 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState("");
  const router = useRouter();

  const signOut = () => {
    firebase.auth().signOut().then(() => {
      setUser("");
      console.log("Successfully signed out.");
    }).catch((error) => {
      console.log(error);
      alert("There was an error when signing out.");
    })
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((result) => {
      if (result) {
        result.providerData.forEach((profile) => {
          if (profile.providerId === "phone") {
            console.log("Already logged in.");
            console.log(profile);
            setUser(profile.uid.substring(2,));
          }
        });
      }
    })
  }, [user]);

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
        { user !== "" && 
          <div>
            <Link href="/create"><input type="submit" value="Create Group"></input></Link>
            <Link href="/join"><input type="submit" value="Join Group"></input></Link>
            <form onSubmit={signOut}>
              <input type="submit" value="Sign Out"></input>
            </form>
          </div>
        }
        {user === "" &&
          <Link href="/signin"><input type="submit" value="Sign In"></input></Link>
        }
      </main>
    </div>
)
}
