import React, {FormEvent, useEffect, useState} from "react";
import {socket} from "../App";
import {Api} from "../Helpers/Api";
import {UserCredentials, UserData} from "../Models/Api";
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export function User({
                         userData,
                         setUserData,
                         updateUserData,
                     }: {
    userData: UserData | undefined;
    setUserData: any;
    updateUserData: () => void;
}) {
    const [userCredentials, setUserCredentials] = useState<UserCredentials | undefined>(undefined);


    async function updateUserCredentials(): Promise<void> {
        await Api.getUserCredentials().then((response: UserCredentials | undefined) => {
            if (response)
                setUserCredentials(response)
        })

    }


    useEffect(() => {
        updateUserCredentials();
        updateUserData();
        socket.on("parsnipBalance", (data) => {
            setUserData((prevUserData: UserData | undefined) => {
                if (prevUserData === undefined) return undefined;

                return {
                    ...prevUserData,
                    parsnipBalance: parseInt(data),
                };
            });
        });
    }, []);

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col>
                        <div> 
                            <p>Hello {userCredentials?.userName}!</p>
                            <p id="lblParsnips">Parsnips: {userData?.parsnipBalance}</p>
                            <p id="lblPPC">{userData?.parsnipsPerClick} Parsnips Per Click (PPC)</p>
                            <p id="lblPPS">{userData?.parsnipsPerSecond} Parsnips Per Second (PPS)</p>
                        </div>
                    </Col>
                    <Col>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
