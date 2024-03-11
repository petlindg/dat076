import React, {FormEvent, useState} from 'react';
import {NavigateFunction, useNavigate} from "react-router-dom";
import {Api} from "../Helpers/Api";
import Button from "react-bootstrap/Button";

interface AccountProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

/**
 * React Component, contains account registration and login logic and forms
 * @param isLoggedIn
 * @param setIsLoggedIn
 * @constructor
 * @returns {Component}
 */
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
        <div className="loginParentDiv">
            <h2>Account</h2>
            <div className="loginDiv">
                <h3>Register</h3>
                <form className="loginForm" onSubmit={async e => await register(e)}>
                    <div className="loginInfoRow">
                        <label htmlFor="userNameRegisterInput">Username: </label>
                        <input id="userNameRegisterInput" type="text" required value={userNameRegister}
                               onChange={e => setUserNameRegister(e.target.value)}/>
                    </div>
                    <div className="loginInfoRow">
                        <label htmlFor="emailRegisterInput">Email: </label>
                        <input id="emailRegisterInput" type="email" required value={emailRegister}
                               onChange={e => setEmailRegister(e.target.value)}/>
                    </div>
                    <div className="loginInfoRow">
                        <label htmlFor="passwordRegisterInput">Password: </label>
                        <input id="passwordRegisterInput" type="password" required value={passwordRegister}
                               onChange={e => setPasswordRegister(e.target.value)}/>
                    </div>
                    <Button className="c1 b1" type="submit">
                        Register
                    </Button>
                </form>
            </div>
            <div className="loginDiv">
                <h3>Login</h3>
                <form className="loginForm" onSubmit={async e => await login(e)}>
                    <div className="loginInfoRow">
                        <label htmlFor="emailLoginInput">Email: </label>
                        <input id="emailLoginInput" type="email" required value={emailLogin}
                               onChange={e => setEmailLogin(e.target.value)}/>
                    </div>
                    <div className="loginInfoRow">
                        <label htmlFor="passwordLoginInput">Password: </label>
                        <input id="passwordLoginInput" type="password" required value={passwordLogin}
                               onChange={e => setPasswordLogin(e.target.value)}/>
                    </div>
                    <Button className="c1 b1" type="submit">
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Account;
