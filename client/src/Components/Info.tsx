import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import {UserStatistics } from "../Models/Api";
import { Api } from "../Helpers/Api";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../App.css'
import { Leaderboard } from './Leaderboard';
import { Statistics } from './Statistics';

export function Info() {
    const navigate: NavigateFunction = useNavigate();

    return (
        <div>
            <Container fluid>
                <Row>
                    <Row className="justify-content-md-end" md="auto">
                    <button onClick={() => {navigate("/")}} >Return</button>
                    </Row>
                </Row>
                <Row>
                    <Container fluid>
                        <Row>
                            <Col>
                                <Statistics/>
                            </Col>
                            <Col>
                                <Leaderboard/>
                            </Col>
                        </Row>
                    </Container>
                </Row>
            </Container>
        </div>
    )
}