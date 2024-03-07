import React, {useEffect, useState} from 'react';
import {Api} from "../Helpers/Api";
import {PowerupActive} from "../Models/Api";
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';


export function PowerupActiveList({updateUserData}: { updateUserData: () => void; }) {
    const [powerUpList, setPowerUpList] = useState<PowerupActive[]>([])


    async function updatePowerupList(): Promise<void> {
        const newPowerUpList: PowerupActive[] = await Api.getPowerupsActiveList()
        setPowerUpList(newPowerUpList)
        updateUserData()
    }

    useEffect(() => {
        updatePowerupList()
    }, []);


    return (
        <Container fluid className="powerup c2">
            <Row>
                
            </Row>
            {powerUpList.map((powerup: PowerupActive) => {
                return <PowerupActiveComponent powerup={powerup} updatePowerupList={updatePowerupList}/>
            })}
        </Container>
    );
}

export function PowerupActiveComponent({powerup, updatePowerupList}: {
    powerup: PowerupActive,
    updatePowerupList: () => void;
}) {

    async function purchasePowerupActive() {
        await Api.purchasePowerupActive(powerup.id)
        updatePowerupList()
    }

    return (
        <div className="powerupElement c3">
            <h1>{powerup.powerupName}</h1>
            <h2>Cost: {powerup.priceForUser}</h2>
            <h2>Parsnips Per Click: +{powerup.parsnipsPerClick}</h2>
            <Button className="c1 b1"onClick={purchasePowerupActive}>
                Buy Powerup
            </Button>
        </div>
    )
}