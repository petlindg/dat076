import React, {ReactElement, useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import Account from "./Account";
import Home from "./Home";
import axios, {AxiosResponse} from "axios";
import {basicErrorHandler} from "./BasicErrorHandler";

axios.defaults.withCredentials = true;
export const baseUrl: string = "http://localhost:8080/"

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    async function checkIsLoggedIn() {
        await axios.get<boolean>(baseUrl + "auth")
            .then((response: AxiosResponse<boolean>) => {
                setIsLoggedIn(response.data)
            }).catch(basicErrorHandler)
    }

    useEffect(() => {
        checkIsLoggedIn()
    }, [isLoggedIn, setIsLoggedIn]);


    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute loggedIn={isLoggedIn}>
                            <Home/>
                        </ProtectedRoute>
                    }/>
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

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({loggedIn, children}) => {
    if (!loggedIn) {
        return <Navigate to="/account" replace/>;
    }

    return children;
};

export default App;
