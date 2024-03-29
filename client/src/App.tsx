import React, {ReactElement, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import Account from "./Components/Account";
import Home from "./Components/Home";
import axios from "axios";
import io, {Socket} from "socket.io-client";
import {Settings} from './Components/Settings';
import {Stats} from './Components/Stats';
import {NavigationBar} from './Components/NavigationBar';
import {Api} from "./Helpers/Api";

axios.defaults.withCredentials = true;
export const baseUrl: string = "http://localhost:8080/"
export const socket: Socket = io(baseUrl, {withCredentials: true, autoConnect: false});

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    async function passiveParsnips() {
        if (isLoggedIn)
            socket.emit('parsnipPassive')
    }

    useEffect(() => {
        document.title = 'Parsnip Puncher';
    }, []);

    useEffect(() => {
        async function checkIsLoggedIn() {
            await Api.getIsLoggedIn()
                .then((response: boolean) => {
                    setIsLoggedIn(response)
                    if (isLoggedIn)
                        socket.connect()
                })
            setIsLoading(false)
        }

        checkIsLoggedIn()
        const interval = setInterval(passiveParsnips, 1000)
        return () => clearInterval(interval)

    }, [isLoggedIn, setIsLoggedIn]);

    if (isLoading)
        return (
            <div>
                <p>Loading...</p>
            </div>
        )

    return (
        <div className="App App-body">
            <NavigationBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ProtectedRoute loggedIn={isLoggedIn}><Home/></ProtectedRoute>}/>
                    <Route path="/stats" element={<ProtectedRoute loggedIn={isLoggedIn}><Stats/></ProtectedRoute>}/>
                    <Route path="/settings" element={<ProtectedRoute loggedIn={isLoggedIn}><Settings/></ProtectedRoute>}/>
                    <Route path="/account" element={<Account isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

interface ProtectedRouteProps {
    loggedIn: boolean;
    children: ReactElement;
}

/**
 * Used to protect routes that require login
 * Will redirect users that are not logged in to the account page
 * @param loggedIn
 * @param children
 * @constructor
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({loggedIn, children}) => {
    if (!loggedIn) {
        return <Navigate to="/account" replace/>;
    }

    return children;
};

export default App;
