import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SignIn() {
    const [phone, setPhone] = useState("");
    const [user, setUser] = useState("");

    const { register, handleSubmit } = useForm();
    const onSubmit = data => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>
                Phone Number:
                <input name="phoneNumber" ref={register({ required: true })} />
            </label>
        </form>
    )
}