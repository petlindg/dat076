import React from 'react';
import axios from "axios";
import {baseUrl} from "../App";
import {basicErrorHandler} from "../Helpers/BasicErrorHandler";

export function PowerupActive({updateUserData}: { updateUserData: () => void; }) {
    async function purchasePowerup() {
        // TODO this hardcoded the powerupActiveId, get it dynamically
        // TODO to do that the list of powerups will have to be retrieved from the API

        await axios.post<String>(baseUrl + "userData/purchaseActivePowerUp", {powerupActiveId: "65d8947a15e5748f2ed42b99"})
            .then(async () => updateUserData())
            .catch(basicErrorHandler)
    }

    return (
        <div>
            <button onClick={purchasePowerup}>
                Buy Powerup
            </button>
        </div>
    );
}