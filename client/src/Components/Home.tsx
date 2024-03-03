import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { ClickableParsnip } from "./ClickableParsnip";
import { User } from "./User";
import { PowerupActiveList } from './PowerupActive';
import { UserData } from "../Models/Api";
import { Api } from "../Helpers/Api";
import { PowerupPassiveList } from './PowerupPassive';
import { NavigateFunction, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../App.css'

function Home() {
    const [userData, setUserData] = useState<UserData | undefined>(undefined);
    const navigate: NavigateFunction = useNavigate();

    useEffect(() => {
        document.title = 'Parsnip Puncher';
    }, []);

    async function updateUserData(): Promise<void> {
        await Api.getUserData().then((response: UserData | undefined) => {
            if (response)
                setUserData(response)
        })
    }

    return (
        <div className="App App-header">
            <Container fluid>
                <Row>                    
                <Col >
                    <User userData={userData} setUserData={setUserData} updateUserData={updateUserData} />
                </Col>
                    <Col>
                        <Row className="justify-content-md-end" md="auto">
                            <button onClick={() => {
                                navigate("/settings")
                            }}>Settings</button>
                        </Row>
                        <Row className="justify-content-md-end" md="auto">
                            <button onClick={() => {
                                navigate("/info")
                            }}>Statistics</button>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <PowerupActiveList updateUserData={updateUserData} />
                    </Col>
                    <Col>
                        <ClickableParsnip />
                    </Col>
                    <Col>
                        <PowerupPassiveList updateUserData={updateUserData} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;