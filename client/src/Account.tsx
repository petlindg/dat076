import React, {FormEvent, useState} from 'react';
import axios from "axios";
import {baseUrl} from "./App";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {basicErrorHandler} from "./BasicErrorHandler";

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

        let errorOccurred = false

        await axios.post<String>(baseUrl + "auth/register", {
            email: emailRegister,
            password: passwordRegister,
            username: userNameRegister
        }).catch(error => {
            errorOccurred = true
            basicErrorHandler(error)
        })

        setEmailRegister("")
        setPasswordRegister("")
        setUserNameRegister("")

        if (errorOccurred)
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

        let errorOccurred = false

        await axios.post<String>(baseUrl + "auth/login", {
            email: emailLogin,
            password: passwordLogin,
        }).catch(error => {
            errorOccurred = true
            basicErrorHandler(error)
        })

        setEmailLogin("")
        setPasswordLogin("")

        if (errorOccurred)
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
                    <input id="userNameRegisterInput" type="text" value={userNameRegister}
                           onChange={e => setUserNameRegister(e.target.value)}/>
                    <input id="emailRegisterInput" type="text" value={emailRegister}
                           onChange={e => setEmailRegister(e.target.value)}/>
                    <input id="passwordRegisterInput" type="password" value={passwordRegister}
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
                    <input id="emailLoginInput" type="text" value={emailLogin}
                           onChange={e => setEmailLogin(e.target.value)}/>
                    <input id="passwordLoginInput" type="password" value={passwordLogin}
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
