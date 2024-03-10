import {useEffect, useState} from 'react';
import {UserStatistics} from "../Models/Api";
import {Api} from "../Helpers/Api";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../App.css'

/**
 * React component, the accumulated statistics of the currently logged in player
 * @returns {Component}
 */
export function PlayerStatistics() {
    const [userStatistics, setUserStatistics] = useState<UserStatistics | undefined>(undefined);
    useEffect(() => {
        updateUserStatistics();
    }, []);


    async function updateUserStatistics(): Promise<void> {
        await Api.getUserStatistics().then((response: UserStatistics | undefined) => {
            if (response)
                setUserStatistics(response)
        })
    }

    return (
        <div>
            <Container fluid className="powerupElement c2">
                <Col>
                    {/* TODO Make actual username instead of id */}
                    <Row ><h1>Your Statistics:</h1></Row>
                    <Row><p>Parsnips per click: {userStatistics?.parsnipsPerClick}</p></Row>
                    <Row><p>Parsnips per Second: {userStatistics?.parsnipsPerSecond}</p></Row>
                    <Row><p>Total powerups purchased: {userStatistics?.totalPowerupsPurchased}</p></Row>
                    <Row><p>Lifetime Clicks: {userStatistics?.lifetimeClicks}</p></Row>
                    <Row><p>Lifetime Parsnips Earned: {userStatistics?.lifetimeParsnipsEarned}</p></Row>
                    <Row><p>Lifetime Parsnips Spent: {userStatistics?.lifetimeParsnipsSpent}</p></Row>
                </Col>
            </Container>
        </div>
    )
}


