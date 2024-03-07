import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {LeaderboardQuery, leaderboardSortBy, UserLeaderboard} from "../Models/Api";
import {Api} from "../Helpers/Api";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../App.css'
import Dropdown from 'react-bootstrap/esm/Dropdown';

export function Leaderboard() {
    const [userLeaderboard, setUserLeaderboard] = useState<UserLeaderboard[]>([]);

    let query:LeaderboardQuery = {sortBy:leaderboardSortBy.lifetimeParsnipsEarned, limit:30}

    useEffect(() => {
        updateUsersLeaderboard(query);
    }, []);

    async function updateQuery(sortBy:leaderboardSortBy) {
        query.sortBy=sortBy
        updateUsersLeaderboard(query)
    }

    async function updateUsersLeaderboard(query:LeaderboardQuery): Promise<void> {
        await Api.getUsersLeaderboard(query).then((response: UserLeaderboard[] | undefined) => {
            if (response)
                setUserLeaderboard(response)
        })
    }

    return (
        <Container fluid>
            <Col>
                <Row>
                    <SortSelector updateQuery={updateQuery}/>
                </Row>
                <div className="leaderboard">
                    <Row>
                        {userLeaderboard.map((leaderboardEntry:UserLeaderboard) => {
                            return <LeaderboardEntry leaderboardEntry={leaderboardEntry}/>
                        })}
                    </Row>
                </div>
            </Col>
        </Container>
    )
}

function LeaderboardEntry({leaderboardEntry} : {leaderboardEntry:UserLeaderboard}) {

    return (
        <div>
            <h2>Username: {leaderboardEntry.username}</h2>
            <p>Place: {leaderboardEntry.place}</p>
            <p>Parsnips earned: {leaderboardEntry.lifetimeParsnipsEarned}</p>
            <p>Parsnips spent: {leaderboardEntry.lifetimeParsnipsSpent}</p>
            <p>Parsnips clicked: {leaderboardEntry.lifetimeClicks}</p>
            <p>Powerups Purchased: {leaderboardEntry.totalPowerupsPurchased}</p>
            <p>PPC: {leaderboardEntry.parsnipsPerClick}</p>
            <p>PPS: {leaderboardEntry.parsnipsPerSecond}</p>
        </div>
    )
}

function SortSelector({updateQuery} : {updateQuery : (sortBy:leaderboardSortBy) => void}) {

    return (
        <Dropdown>
            <Dropdown.Toggle variant="success">
                Sort by:
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {(Object.keys(leaderboardSortBy) as Array<leaderboardSortBy>).map((sortBy) => 
                    <Dropdown.Item onClick={() => updateQuery(sortBy)}>{sortBy}</Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    )
}