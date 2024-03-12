import React, {FormEvent, useState} from 'react';
import {Api} from "../Helpers/Api";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import {userCursor} from '../Models/Api';
import Dropdown from 'react-bootstrap/esm/Dropdown';

/**
 * React component, a page consisting of changeable settings available for the user
 * @returns {Component}
 */
export function Settings() {
    return (
        <Container fluid>
            <Row>
                <ChangeUsername></ChangeUsername>
            </Row>
            <Row>
                <ChangeCursor></ChangeCursor>
            </Row>
        </Container>
    )
}

function ChangeCursor() {
    async function changeCursor(newCursor:userCursor) {
        await Api.updateCursor(newCursor)
    }

    return (
        <div>
            <h3>Change cursor</h3>
            <Dropdown className="dropdownFilter">
                <Dropdown.Toggle className="c1">
                    Cursor:
                </Dropdown.Toggle>
        
                <Dropdown.Menu>
                    {(Object.keys(userCursor) as Array<userCursor>).map((newCursor) => 
                        <Dropdown.Item key={newCursor} onClick={() => changeCursor(newCursor)}>{newCursor}</Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

function ChangeUsername() {
    const [newUserName, setNewUserName] = useState<string>("");

    async function changeUsername(e: FormEvent) {
        e.preventDefault();
        if (newUserName === "" || newUserName === undefined) {
            alert("New username may not be empty");
            return;
        }

        await Api.updateUsername(newUserName)

        setNewUserName("");
    }

    return (
        <div>
            <h3>Change username</h3>
            <label htmlFor="userNameUpdateInput">Input your new username: </label>
            <form className="loginForm" onSubmit={async (e) => await changeUsername(e)}>
                <input
                    data-testid="userNameUpdateInput"
                    id="userNameUpdateInput"
                    type="text"
                    value={newUserName}
                    required
                    onChange={(e) => {
                        setNewUserName(e.target.value);
                    }}></input>


                <Button id="userNameUpdateSubmitButton" className="c1 b1" type="submit">
                    Submit Username
                </Button>
            </form>
        </div>)
}