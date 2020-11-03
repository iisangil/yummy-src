import Head from 'next/head';
import { useForm } from 'react-hook-form';

export default function SignIn() {
    const { register, errors, handleSubmit } = useForm();
    // on submit log in with firebase
    const onSubmit = data => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>
                Phone Number:
                <input 
                 name="number"
                 type="text"
                 ref={register({ required: true, maxLength: 10, minLength: 10 })}
                />
            </label>
            <input type="submit" value="Submit"></input>
            {errors.number?.type === "required" &&
             "Your input is required."}
            {errors.number?.type === "maxLength" &&
             "Your input is too long."}
            {errors.number?.type === "minLength" &&
             "Your input is too short."}
        </form>
    )
}