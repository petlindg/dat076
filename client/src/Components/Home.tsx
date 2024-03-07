import React, { useState } from 'react';
import { ClickableParsnip } from "./ClickableParsnip";
import { User } from "./User";
import { PowerupActiveList } from './PowerupActive';
import { UserData } from "../Models/Api";
import { Api } from "../Helpers/Api";
import { PowerupPassiveList } from './PowerupPassive';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Home() {
    const [userData, setUserData] = useState<UserData | undefined>(undefined);

    async function updateUserData(): Promise<void> {
        await Api.getUserData().then((response: UserData | undefined) => {
            if (response)
                setUserData(response)
        })
    }

    return (
        <div>
            <Container fluid>
                <Row>
                    <User userData={userData} setUserData={setUserData} updateUserData={updateUserData}/>
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