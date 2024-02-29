import React from 'react';
import {Api} from "../Helpers/Api";

export function PowerupActive({updateUserData}: { updateUserData: () => void; }) {
    async function purchasePowerupActive() {
        // TODO this hardcoded the powerupActiveId, get it dynamically
        // TODO to do that the list of powerups will have to be retrieved from the API

        await Api.purchasePowerupActive("65d8947a15e5748f2ed42b99")
        updateUserData()
    }

    return (
        <div>
            <button onClick={purchasePowerupActive}>
                Buy Powerup
            </button>
        </div>
    );
}