import React, {useEffect, useState} from 'react';
import {Api} from "../Helpers/Api";
import {PowerupPassive} from "../Models/Api";
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container";

/**
 * React component, a list of passive powerups that are purchasable by the player.
 * @param {updateUserData: () => void} updateUserData
 * @returns {Component}
 */
export function PowerupPassiveList({updateUserData}: { updateUserData: () => void; }) {
    const [powerUpList, setPowerUpList] = useState<PowerupPassive[]>([])


    async function updatePowerupList(): Promise<void> {
        const newPowerUpList: PowerupPassive[] = await Api.getPowerupsPassiveList()
        setPowerUpList(newPowerUpList)
        updateUserData()
    }

    useEffect(() => {
        updatePowerupList()
    }, []);


    return (
        <Container fluid className="powerup c2">
            {powerUpList.map((powerup: PowerupPassive) => {
                return <PowerupPassiveComponent powerup={powerup} updatePowerupList={updatePowerupList}/>
            })}
        </Container>
    );
}

export function PowerupPassiveComponent({powerup, updatePowerupList}: {
    powerup: PowerupPassive,
    updatePowerupList: () => void;
}) {

    async function purchasePowerupPassive() {
        await Api.purchasePowerupPassive(powerup.id)
        updatePowerupList()
    }

    return (
        <div className="powerupElement c3">
            <h1>{powerup.powerupName}</h1>
            <h2>Cost: {powerup.priceForUser}</h2>
            <h2>Parsnips Per Second: +{powerup.parsnipsPerSecond}</h2>
            <Button className="c1 b1" onClick={purchasePowerupPassive}>
                Buy Powerup
            </Button>
        </div>
    )
}