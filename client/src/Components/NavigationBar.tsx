import React from 'react'
import Nav from "react-bootstrap/esm/Nav";
import Navbar from "react-bootstrap/esm/Navbar";


export function NavigationBar() {
    return (
        <Navbar className="c2">
            <Nav>
                <Nav.Link className="navButton c1" href="/">Home</Nav.Link>
                <Nav.Link className="navButton c1" href="/stats">Statistics</Nav.Link>
                <Nav.Link className="navButton c1" href="/settings">Settings</Nav.Link>
            </Nav>
        </Navbar>
    )
}