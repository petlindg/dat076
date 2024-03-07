import React, {FormEvent, useEffect, useState} from 'react';
import {UserCredentials} from "../Models/Api";
import {Api} from "../Helpers/Api";

export function Settings() {
    const [userCredentials, setUserCredentials] = useState<UserCredentials | undefined>(undefined);
    const [newUserName, setNewUserName] = useState<string>("");

    useEffect(() => {
        updateUserCredentials();
    }, []);

    async function updateUserCredentials() {
        await Api.getUserCredentials().then((response: UserCredentials | undefined) => {
            if (response)
                setUserCredentials(response)
        })
    }
    async function changeUsername(e: FormEvent) {
        e.preventDefault();
        if (newUserName === "" || newUserName === undefined) {
            alert("New username may not be empty");
            return;
        }

        await Api.updateUsername(newUserName)

        setNewUserName("");
        await updateUserCredentials();
    }


    return (
    <div>
        <p>Change username:</p>
        <label htmlFor="userNameUpdateInput">Input your new username: </label>
        <form onSubmit={async (e) => await changeUsername(e)}>
            <input
                data-testid="userNameUpdateInput"
                id="userNameUpdateInput"
                type="text"
                value={newUserName}
                required
                onChange={(e) => {
                    setNewUserName(e.target.value);
                }}></input>

            <button id="userNameUpdateSubmitButton" type="submit">
                Submit Username
            </button>
        </form>
    </div>)
}


