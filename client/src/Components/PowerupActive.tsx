import React, { useEffect, useState } from 'react';
import { Api, PowerupActive } from "../Helpers/Api";




export function PowerupActiveList({updateUserData}: { updateUserData: () => void; }) {
    const [powerUpList, setPowerUpList] = useState<PowerupActive[]> ([])


    async function updatePowerupList(): Promise<void> {
        const newPowerUpList:PowerupActive[] = await Api.getPowerupsActiveList()
        setPowerUpList(newPowerUpList)
    }

    useEffect(() => {
        updatePowerupList()
    }, []);
    

    return (
        <div>
            {powerUpList.map((powerup:PowerupActive) => {
                return <PowerupActiveComponent powerup={powerup} updateUserData={updateUserData}/>
            })}
        </div>
    );
}

export function PowerupActiveComponent({powerup, updateUserData}: { powerup:PowerupActive, updateUserData: () => void; }) {

    async function purchasePowerupActive() {
        await Api.purchasePowerupActive(powerup.id)
        updateUserData()
    }

    return (
        <div>
            <h1>{powerup.powerupName}</h1>
            <h2>Cost: {powerup.priceForUser}</h2>
            <button onClick={purchasePowerupActive}>
                Buy Powerup
            </button>
        </div>
    )
}