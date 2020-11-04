import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';
import firebase from '../config/firebase';

const axios = require('axios').default

export default function Groups() {
    const [group, setGroup] = useState("");
    const router = useRouter();
    const { self } = router.query;

    useEffect(() => {
        // check if logged in
        firebase.auth().onAuthStateChanged((res) => {
            if (!res) {
                router.push("/signin");
            }
        });
        console.log("i need to check if user is in a group already");
    }, []);

    const createGroup = (e) => {
        e.preventDefault();

        var groupid = nanoid(6);
        setGroup(groupid);
        console.log(groupid);
        
        var userArray = [
            { "userid": self, groupid, }
        ];

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
    }

    const joinGroup = (e) => {
        e.preventDefault();
        console.log("This is not implemented yet lol");
    }

    const leaveGroup = (e) => {
        e.preventDefault();
        console.log("This is not yet implemented yet either lol");
    }

    return (
        <div>
            {group === "" &&
            <div>
                <form onSubmit={createGroup}>
                    <input type="submit" value="Create Group"></input>
                </form>
                <form onSubmit={joinGroup}>
                    <input type="submit" value="Join Group"></input>
                </form>
            </div>
            }
            {group !== "" &&
            <div>
                Share this code with your friends: {group}
                <form onSubmit={leaveGroup}>
                    <input type="submit" value="Leave Group"></input>
                </form>
            </div>
            }
            <Link href="/"><input type="submit" value="Back"></input></Link>
        </div>
    )
}