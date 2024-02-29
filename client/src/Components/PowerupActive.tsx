import React, {useEffect, useState} from 'react';
import {Api} from "../Helpers/Api";
import {PowerupActive} from "../Models/Api";
import Button from 'react-bootstrap/Button'


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
        <div>
            {powerUpList.map((powerup: PowerupActive) => {
                return <PowerupActiveComponent powerup={powerup} updatePowerupList={updatePowerupList}/>
            })}
        </div>
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
        <div>
            <h1>{powerup.powerupName}</h1>
            <h2>Cost: {powerup.priceForUser}</h2>
            <h2>Parsnips Per Click: +{powerup.parsnipsPerClick}</h2>
            <Button onClick={purchasePowerupActive}>
                Buy Powerup
            </Button>
        </div>
    )
}