import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../App.css'
import { Leaderboard } from './Leaderboard';
import { PlayerStatistics } from './PlayerStatistics';

export function Info() {

    return (
        <div>
            <Container fluid>
                <Row>
                    <Container fluid>
                        <Row>
                            <Col>
                                <PlayerStatistics/>
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