import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Account from "./Account";
import Home from "./Home";
import axios from "axios";

axios.defaults.withCredentials = true;
export const baseUrl: string = "http://localhost:8080/"

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" Component={Home}/>
                    <Route path="/account" Component={Account}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
