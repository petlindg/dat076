import {useEffect, useState} from 'react';
import {UserStatistics} from "../Models/Api";
import {Api} from "../Helpers/Api";
import Container from 'react-bootstrap/Container'
import '../App.css'

/**
 * React component, the accumulated statistics of the currently logged in player
 * @returns {Component}
 */
export function PlayerStatistics() {
    const [userStatistics, setUserStatistics] = useState<UserStatistics | undefined>(undefined);
    useEffect(() => {
        updateUserStatistics();
    }, []);


    async function updateUserStatistics(): Promise<void> {
        await Api.getUserStatistics().then((response: UserStatistics | undefined) => {
            if (response)
                setUserStatistics(response)
        })
    }

    return (
        <div className="statistics c2">
            <h1>Your Statistics:</h1>
            <p>Parsnips per click: {userStatistics?.parsnipsPerClick}</p>
            <p>Parsnips per Second: {userStatistics?.parsnipsPerSecond}</p>
            <p>Total powerups purchased: {userStatistics?.totalPowerupsPurchased}</p>
            <p>Lifetime Clicks: {userStatistics?.lifetimeClicks}</p>
            <p>Lifetime Parsnips Earned: {userStatistics?.lifetimeParsnipsEarned}</p>
            <p>Lifetime Parsnips Spent: {userStatistics?.lifetimeParsnipsSpent}</p>
        </div>
    )
}


