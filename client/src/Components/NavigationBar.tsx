import React from 'react'
import Nav from "react-bootstrap/esm/Nav";
import Navbar from "react-bootstrap/esm/Navbar";


export function NavigationBar() {
    return (
        <Navbar>
            <Nav>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/info">Statistics</Nav.Link>
                <Nav.Link href="/settings">Settings</Nav.Link>
            </Nav>
        </Navbar>
    )
}