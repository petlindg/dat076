import 'bootstrap/dist/css/bootstrap.min.css';
import React, { FormEvent, useEffect, useState } from 'react';
import { User } from "./User";
import { UserCredentials } from "../Models/Api";
import { Api } from "../Helpers/Api";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../App.css'

export function Settings() {
    const navigate: NavigateFunction = useNavigate();
    const [userCredentials, setUserCredentials] = useState<UserCredentials | undefined>(undefined);
    const [newUserName, setNewUserName] = useState<string>("");

    useEffect(() => {
        updateUserCredentials();
    }, []);

    async function updateUserCredentials() {
        await Api.getUserCredentials().then((response: UserCredentials | undefined) => {
            if (response)
                setUserCredentials(response)
        })
    }
    async function changeUsername(e: FormEvent) {
        e.preventDefault();
        if (newUserName === "" || newUserName === undefined) {
            alert("New username may not be empty");
            return;
        }

        await Api.updateUsername(newUserName)

        setNewUserName("");
        await updateUserCredentials();
    }


    return (
    <div>
        <Container fluid>
            <Col>
                <Row className="justify-content-md-end" md="auto">
                <button onClick={() => {navigate("/")}}>Return</button>
                </Row> 
            </Col>
        <Col>
        <p>Change username:</p>
        <label htmlFor="userNameUpdateInput">Input your new username: </label>
        <form onSubmit={async (e) => await changeUsername(e)}>
            <input
                data-testid="userNameUpdateInput"
                id="userNameUpdateInput"
                type="text"
                value={newUserName}
                onChange={(e) => {
                    setNewUserName(e.target.value);
                }}></input>

            <button id="userNameUpdateSubmitButton" type="submit">
                Submit Username
            </button>
        </form>
        </Col>
        

        
        </Container>
    </div>)
}


