import React, { Component } from 'react'
import Nav from "react-bootstrap/esm/Nav";
import Navbar from "react-bootstrap/esm/Navbar";
import {Api} from "../Helpers/Api";
import Button from "react-bootstrap/Button";
import {socket} from "../App";

/**
 * React component, navigation bar of the website redirecting to all hrefs relevant to the user
 * @returns {Component}
 */
export function NavigationBar({isLoggedIn, setIsLoggedIn}: {isLoggedIn: boolean; setIsLoggedIn: any}) {

    async function logOut(){
        if(!isLoggedIn)
            return

        Api.logout()
        socket.disconnect()
        setIsLoggedIn(false)
    }

    return (
        <Navbar className="c2">
            <Nav>
                <Nav.Link className="navButton c1" href="/">Home</Nav.Link>
                <Nav.Link className="navButton c1" href="/stats">Statistics</Nav.Link>
                <Nav.Link className="navButton c1" href="/settings">Settings</Nav.Link>
            </Nav>
            {isLoggedIn ? <Button className="logoutButton c1" onClick={logOut}>Log Out</Button> : null }
        </Navbar>
    )
}