import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import auth from '../config/firebase';
// import firebaseConfig from '../constants/firebaseConfig';
// import * as firebase from 'firebase/app';
// import 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState("");
  const router = useRouter();

  const signOut = () => {
    console.log("sign out begin")
    auth.signOut().then(() => {
      console.log("signed out");
      setUser("");
    }).catch((error) => {
      console.log(error);
      alert("There was an error when signing out.");
    })
  }

  useEffect(() => {
    auth.onAuthStateChanged((result) => {
      if (result) {
        result.providerData.forEach((profile) => {
          if (profile.providerId === "phone") {
            console.log("logged in already");
            console.log(profile);
            setUser(profile.uid.substring(2,));
          }
        });
      } else {
        router.push("/signin");
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

        { user !== "" && 
          <div>
            <div>Create a group, join a group</div>
            <form onSubmit={signOut}>
              <input type="submit" value="Sign Out"></input>
            </form>
          </div>
        }
      </main>
    </div>
)
}
