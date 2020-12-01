import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import { nanoid } from 'nanoid';
import firebase from '../config/firebase';
import { useForm } from 'react-hook-form';

const axios = require('axios').default

export default function Groups() {
    const [user, setUser] = useState('');
    const [group, setGroup] = useState('');

    useEffect(() => {
        // check if logged in
        firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                setUser(user);
            } else {
                Router.push("/signin")
            }
        });
        console.log("i need to check if user is in a group already");
    }, []);

    const createGroup = (e) => {
        e.preventDefault();

        var groupid = nanoid(6);
        setGroup(groupid);
        console.log(groupid);
        
        var userArray = [self];
        axios({
            method: 'post',
            url: 'http://localhost:8080/create',
            data: {
                groupid,
                users: userArray,
            },
            params: {
                self,
            }
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    };

    const { register, handleSubmit, errors } = useForm();
    const joinGroup = (data) => {
        var groupid = data["code"];
        setGroup(groupid);
        console.log(groupid);

        axios({
            method: 'post',
            url: 'http://localhost:8080/join',
            data: {
                groupid,
                users: null,
            },
            params: {
                self,
            }
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    };

    const leaveGroup = (e) => {
        e.preventDefault();
        console.log("This is not yet implemented yet either lol");
    };

    const signOut = (e) => {
        e.preventDefault();

        firebase.auth().signOut().then(() => {
            setUser("");
            console.log("Successfully signed out.");
        }).catch((error) => {
            console.log(error);
            alert("There was an error when signing out.");
        })
    }

    return (
        <div>
            <Head>
                <title>Yummy</title>
            </Head>
            {group === "" &&
            <div>
                <form onSubmit={createGroup}>
                    <input type='submit' value='Create Group' />
                </form>
                <form onSubmit={handleSubmit(joinGroup)}>
                    <label>
                        Enter Code:
                        <input type='text' name='code' ref={register({ required: true, minLength: 6, maxLength: 6 })} />
                    </label>
                    <input type='submit' value='Join Group' />
                    {errors.code?.type === 'required' && <span role='alert'>Enter Code</span>}
                    {errors.code?.type === 'minLength' && <span role='alert'>Code must be six characters</span>}
                    {errors.code?.type === 'maxLength' && <span role='alert'>Code must be six characters</span>}
                </form>
            </div>
            }
            {group !== "" &&
            <div>
                Share this code with your friends: {group}
                <form onSubmit={leaveGroup}>
                    <input type='submit' value='Leave Group'></input>
                </form>
            </div>
            }
            <Link href='/'><input type='submit' value='Back'></input></Link>
            {group !== "" &&
            <div>
                Restaurants go here!
            </div>
            }
            <form onSubmit={signOut}>
                <input type='submit' value='Sign Out' />
            </form>
        </div>
    )
}