import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { ClickableParsnip } from "./ClickableParsnip";
import { User } from "./User";
import { PowerupActiveList } from './PowerupActive';
import { UserData, UserCredentials, UserStatistics } from "../Models/Api";
import { Api } from "../Helpers/Api";
import { PowerupPassiveList } from './PowerupPassive';
import { NavigateFunction, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../App.css'

export function Statistics() {
    useEffect(() => {
        updateUserStatistics();
    }, []);
    const navigate: NavigateFunction = useNavigate();
    const [userStatistics, setUserStatistics] = useState<UserStatistics | undefined>(undefined);

    async function updateUserStatistics(): Promise<void> {
        await Api.getUserStatistics().then((response: UserStatistics | undefined) => {
            if (response)
                setUserStatistics(response)
        })
    }

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col>
                    <h1>Statistics for {userStatistics?.idUserCredentials} </h1></Col>
                    <Col>
                    <button onClick={() => {
                        navigate("/")
                    }}>Back</button></Col> 
                </Row>
                <Row>
                    <p>Lifetime clicks: {userStatistics?.lifetimeClicks}</p>
                </Row>
                <Row>
                </Row>
            </Container>
        </div>
    )
}


