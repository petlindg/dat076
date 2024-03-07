import React, {FormEvent, useState} from 'react';
import {NavigateFunction, useNavigate} from "react-router-dom";
import {Api} from "../Helpers/Api";

interface AccountProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Account: React.FC<AccountProps> = ({isLoggedIn, setIsLoggedIn}) => {
    const navigate: NavigateFunction = useNavigate();
    const [userNameRegister, setUserNameRegister] = useState<string>("")
    const [emailRegister, setEmailRegister] = useState<string>("")
    const [passwordRegister, setPasswordRegister] = useState<string>("")
    const [emailLogin, setEmailLogin] = useState<string>("")
    const [passwordLogin, setPasswordLogin] = useState<string>("")

    async function register(e: FormEvent): Promise<void> {
        e.preventDefault()
        if (userNameRegister === "" || userNameRegister === undefined || emailRegister === "" || emailRegister === undefined || passwordRegister === "" || passwordRegister === undefined) {
            alert("Invalid credentials format");
            return
        }

        const success: boolean = await Api.register({
            email: emailRegister,
            password: passwordRegister,
            username: userNameRegister
        })

        setEmailRegister("")
        setPasswordRegister("")
        setUserNameRegister("")

        if (!success)
            return setIsLoggedIn(false)

        setIsLoggedIn(true)
        return navigate("/")
    }

    async function login(e: FormEvent): Promise<void> {
        e.preventDefault()
        if (emailLogin === "" || emailLogin === undefined || passwordLogin === "" || passwordLogin === undefined) {
            alert("Invalid credentials format");
            return
        }

        const success: boolean = await Api.login({
            email: emailLogin,
            password: passwordLogin,
        })

        console.log("Login ok " + success)

        setEmailLogin("")
        setPasswordLogin("")

        if (!success)
            return setIsLoggedIn(false)


        setIsLoggedIn(true)
        return navigate("/")
    }

    return (
        <div>
            <h2>Account Page</h2>
            <div>
                <h3>Register</h3>
                <label htmlFor="userNameRegisterInput">Username: </label>
                <label htmlFor="emailRegisterInput">Email: </label>
                <label htmlFor="passwordRegisterInput">Password: </label>
                <form onSubmit={async e => await register(e)}>
                    <input id="userNameRegisterInput" type="text" required value={userNameRegister}
                           onChange={e => setUserNameRegister(e.target.value)}/>
                    <input id="emailRegisterInput" type="email" required value={emailRegister}
                           onChange={e => setEmailRegister(e.target.value)}/>
                    <input id="passwordRegisterInput" type="password" required value={passwordRegister}
                           onChange={e => setPasswordRegister(e.target.value)}/>
                    <button type="submit">
                        Register
                    </button>
                </form>
            </div>
            <div>
                <h3>Login</h3>
                <label htmlFor="emailLoginInput">Email: </label>
                <label htmlFor="passwordLoginInput">Password: </label>
                <form onSubmit={async e => await login(e)}>
                    <input id="emailLoginInput" type="email" required value={emailLogin}
                           onChange={e => setEmailLogin(e.target.value)}/>
                    <input id="passwordLoginInput" type="password" required value={passwordLogin}
                           onChange={e => setPasswordLogin(e.target.value)}/>
                    <button type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Account;
