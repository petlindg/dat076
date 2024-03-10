import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {Leaderboard} from './Leaderboard';
import {PlayerStatistics} from './PlayerStatistics';

export function Stats() {

    return (
        <div>
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
        </div>
    )
}