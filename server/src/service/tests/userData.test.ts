import {userCredentialsModel} from "../../db/userCredentials.db";
import {IUserDataService} from "../interfaces/userData.interface";
import {UserDataService} from "../userData";
import {userDataModel} from "../../db/userData.db";
import {powerupActiveModel} from "../../db/powerupActive.db";
import {UserCredentials} from "../../model/userCredentials";
import {leaderboardSortBy, UserData, UserLeaderboard, UserStatistics} from "../../model/userData";
import {PowerupActive} from "../../model/powerupActive";
import {ObjectId} from "mongodb";
import {PowerupPriceHelpers} from "../../helpers/powerupPriceHelpers";
import {PowerupPassive} from "../../model/powerupPassive";
import {powerupPassiveModel} from "../../db/powerupPassive.db";

afterEach(async (): Promise<void> => {
    await (await userCredentialsModel).deleteMany()
    await (await userDataModel).deleteMany()
    await (await powerupActiveModel).deleteMany()
})

jest.mock("../../db/conn")
const userDataService: IUserDataService = new UserDataService()

const userName1: string = "1";
const email1: string = "1@email.com";
const password1: string = "pass1";
const parsnipsPerClick1: 7 = 7;
const parsnipsPerSecond1: 0 = 0;
const parsnipBalance1: 2 = 2;
const lifetimeClicks1: number = 100;
const lifetimeParsnipEarned1: number = 236;
const lifetimeParsnipSpent1: number = 54;
const userName2: string = "2";
const email2: string = "2@email.com";
const password2: string = "pass2";
const parsnipsPerClick2: 11 = 11;
const parsnipsPerSecond2: 0 = 0;
const parsnipBalance2: 100 = 100;
const lifetimeClicks2: number = 100;
const lifetimeParsnipEarned2: number = 109;
const lifetimeParsnipSpent2: number = 67;
const userName3: string = "3";
const email3: string = "3@email.com";
const password3: string = "pass3";
const parsnipsPerClick3: 15 = 15;
const parsnipsPerSecond3: 0 = 0;
const parsnipBalance3: 0 = 0;
const lifetimeClicks3: number = 200;
const lifetimeParsnipEarned3: number = 345;
const lifetimeParsnipSpent3: number = 345;
const powerupName1: string = "a";
const powerupName2: string = "b";
const powerupName3: string = "c";
const basePrice: number = 10;
const increment: number = 0.15;
const parsnipsPerClickPowerup: number = 3;
const parsnipsPerSecondPowerup: number = 0.1;
const powerup1PurchaseCount: number = 2;
const powerup2PurchaseCount: number = 4;
const powerup3PurchaseCount: number = 6;

async function buildUserCredentials(userName: string, email: string, password: string): Promise<UserCredentials> {
    return await (await userCredentialsModel).create({
        userName: userName,
        email: email,
        password: password,
    })
}

async function buildPowerupActive(name: string): Promise<PowerupActive> {
    return await (await powerupActiveModel).create({
        powerupName: name,
        basePrice: basePrice,
        increment: increment,
        parsnipsPerClick: parsnipsPerClickPowerup
    })
}

async function buildPowerupPassive(name: string): Promise<PowerupPassive> {
    return await (await powerupPassiveModel).create({
        powerupName: name,
        basePrice: basePrice,
        increment: increment,
        parsnipsPerSecond: parsnipsPerSecondPowerup
    })
}

async function buildUserData(powerupActive:boolean, ucId: ObjectId, paId: ObjectId, parsnipBalance: number, parsnipPerClick: number, lifetimeClicks: number, lifetimeParsnipsEarned: number, lifetimeParsnipsSpent: number, parsnipsPerSecond: number): Promise<UserData> {

    return await (await userDataModel).create({
        credentialsId: ucId,
        parsnipBalance: parsnipBalance,
        parsnipsPerClick: parsnipPerClick,
        powerupsActivePurchased: (powerupActive)?[{idPowerup: paId, purchaseCount: powerup1PurchaseCount}]:[],
        powerupsPassivePurchased: (!powerupActive)?[{idPowerup: paId, purchaseCount: powerup1PurchaseCount}]:[],
        lifetimeClicks: lifetimeClicks,
        lifetimeParsnipsEarned: lifetimeParsnipsEarned,
        lifetimeParsnipsSpent: lifetimeParsnipsSpent,
        parsnipsPerSecond: parsnipsPerSecond
    })
}

describe("User Data Service tests", () => {


    it("Getting user data should return correct user data", async () => {

        const userCredentials: UserCredentials = await buildUserCredentials(userName1, email1, password1)
        const powerUpActive1: PowerupActive = await buildPowerupActive(powerupName1)
        const userData: UserData = await buildUserData(true, userCredentials.id, powerUpActive1.id, parsnipBalance1, parsnipsPerClick1, lifetimeClicks1, lifetimeParsnipEarned1, lifetimeParsnipSpent1, parsnipsPerSecond1)

        await expect(userDataService.getUserData(userData.id)).rejects.toThrow()

        const result: UserData = await userDataService.getUserData(userCredentials.id)

        expect(result.id).toEqual(userData.id)
        expect(result.credentialsId.toString()).toEqual(userCredentials.id.toString())
        expect(result.parsnipBalance).toEqual(parsnipBalance1)
        expect(result.parsnipsPerClick).toEqual(parsnipsPerClick1)
        expect(result.powerupsActivePurchased.length).toEqual(1)
        expect(result.powerupsActivePurchased[0].idPowerup.toString()).toEqual(powerUpActive1.id.toString())
        expect(result.powerupsActivePurchased[0].purchaseCount).toEqual(powerup1PurchaseCount)
        expect(result.powerupsPassivePurchased).toEqual([])
        expect(result.lifetimeClicks).toEqual(lifetimeClicks1)
        expect(result.lifetimeParsnipsEarned).toEqual(lifetimeParsnipEarned1)
        expect(result.lifetimeParsnipsSpent).toEqual(lifetimeParsnipSpent1)
    });

    it("Incrementing user parsnip should increase their balance by their parsnip per click", async () => {

        const userCredentials: UserCredentials = await buildUserCredentials(userName1, email1, password1)
        const powerUpActive1: PowerupActive = await buildPowerupActive(powerupName1)
        const userData: UserData = await buildUserData(true, userCredentials.id, powerUpActive1.id, parsnipBalance1, parsnipsPerClick1, lifetimeClicks1, lifetimeParsnipEarned1, lifetimeParsnipSpent1, parsnipsPerSecond1)

        await expect(userDataService.getUserData(powerUpActive1.id)).rejects.toThrow()

        const result: number = await userDataService.incrementParsnip(userCredentials.id)
        const newUserData: UserData = await userDataService.getUserData(userCredentials.id)

        expect(newUserData.parsnipBalance).toEqual(userData.parsnipBalance + userData.parsnipsPerClick)
        expect(newUserData.lifetimeClicks).toEqual(userData.lifetimeClicks + 1)
        expect(newUserData.lifetimeParsnipsEarned).toEqual(userData.lifetimeParsnipsEarned + userData.parsnipsPerClick)
        expect(result).toEqual(newUserData.parsnipBalance)
    })

    it("Buying a powerup should reduce the user's balance by its price and increase the user's parsnipsPerClick by the powerup's parsnips per click, if the user can afford it", async () => {

        const userCredentials: UserCredentials = await buildUserCredentials(userName1, email1, password1)
        const powerUpActive1: PowerupActive = await buildPowerupActive(powerupName1)
        const userData: UserData = await buildUserData(true, userCredentials.id, powerUpActive1.id, parsnipBalance1, parsnipsPerClick1, lifetimeClicks1, lifetimeParsnipEarned1, lifetimeParsnipSpent1, parsnipsPerSecond1)

        const result1: boolean = await userDataService.purchasePowerupActive(userCredentials.id, powerUpActive1.id)
        expect(result1).toBeFalsy()

        let balance: number = userData.parsnipBalance
        for (let i = 0; i < 10; i++)
            balance = await userDataService.incrementParsnip(userCredentials.id)

        await expect(userDataService.purchasePowerupActive(userCredentials.id, userData.id)).rejects.toThrow()
        await expect(userDataService.purchasePowerupActive(userData.id, powerUpActive1.id)).rejects.toThrow()

        const result2: boolean = await userDataService.purchasePowerupActive(userCredentials.id, powerUpActive1.id)
        const userData2: UserData = await userDataService.getUserData(userCredentials.id)

        expect(result2).toBeTruthy()
        expect(userData2.parsnipBalance).toEqual(balance - PowerupPriceHelpers.computePrice(powerUpActive1.basePrice, powerUpActive1.increment, powerup1PurchaseCount))
        expect(userData2.parsnipsPerClick).toEqual(userData.parsnipsPerClick + powerUpActive1.parsnipsPerClick)
        expect(userData2.powerupsActivePurchased.find(pap => pap.idPowerup.toString() === powerUpActive1.id.toString())).toBeDefined()
        expect(userData2.powerupsActivePurchased.find(pap => pap.idPowerup.toString() === powerUpActive1.id.toString())!.purchaseCount)
            .toEqual(userData.powerupsActivePurchased.find(pap => pap.idPowerup.toString() === powerUpActive1.id.toString())!.purchaseCount + 1)
        expect(userData2.lifetimeParsnipsSpent).toEqual(userData.lifetimeParsnipsSpent + PowerupPriceHelpers.computePrice(powerUpActive1.basePrice, powerUpActive1.increment, powerup1PurchaseCount))
    })

    it("Getting user statistics, should return correct statistics", async () => {
        const userCredentials: UserCredentials = await buildUserCredentials(userName1, email1, password1)
        const powerUpActive1: PowerupActive = await buildPowerupActive(powerupName1)
        const powerUpActive2: PowerupActive = await buildPowerupActive(powerupName2)
        const powerUpActive3: PowerupActive = await buildPowerupActive(powerupName3)
        await (await userDataModel).create({
            credentialsId: userCredentials.id,
            parsnipBalance: parsnipBalance1,
            parsnipsPerClick: parsnipsPerClick1,
            powerupsActivePurchased: [
                {idPowerup: powerUpActive1.id, purchaseCount: powerup1PurchaseCount},
                {idPowerup: powerUpActive2.id, purchaseCount: powerup2PurchaseCount},
                {idPowerup: powerUpActive3.id, purchaseCount: powerup3PurchaseCount},
            ],
            powerupsPassivePurchased: [],
            lifetimeClicks: 100,
            lifetimeParsnipsEarned: 236,
            lifetimeParsnipsSpent: 54,
        })

        const userStatistics: UserStatistics = await userDataService.getUserStatistic(userCredentials.id)

        expect(userStatistics.idUserCredentials.toString()).toEqual(userCredentials.id.toString())
        expect(userStatistics.lifetimeClicks).toEqual(lifetimeClicks1)
        expect(userStatistics.lifetimeParsnipsEarned).toEqual(lifetimeParsnipEarned1)
        expect(userStatistics.lifetimeParsnipsSpent).toEqual(lifetimeParsnipSpent1)
        expect(userStatistics.parsnipsPerClick).toEqual(parsnipsPerClick1)
        expect(userStatistics.parsnipBalance).toEqual(parsnipBalance1)
        expect(userStatistics.totalPowerupsPurchased).toEqual(powerup1PurchaseCount + powerup2PurchaseCount + powerup3PurchaseCount)

    })

    it("Getting a user leaderboard, should return the correctly sized and ordered leaderboard", async () => {

        await expect(userDataService.getUserLeaderboard("wrong" as leaderboardSortBy, 10)).rejects.toThrow()
        const userCredentials1: UserCredentials = await buildUserCredentials(userName1, email1, password1)
        const userCredentials2: UserCredentials = await buildUserCredentials(userName2, email2, password2)
        const userCredentials3: UserCredentials = await buildUserCredentials(userName3, email3, password3)
        const powerUpActive1: PowerupActive = await buildPowerupActive(powerupName1)
        await buildUserData(true, userCredentials1.id, powerUpActive1.id, parsnipBalance1, parsnipsPerClick1, lifetimeClicks1, lifetimeParsnipEarned1, lifetimeParsnipSpent1, parsnipsPerSecond1)
        await buildUserData(true, userCredentials2.id, powerUpActive1.id, parsnipBalance2, parsnipsPerClick2, lifetimeClicks2, lifetimeParsnipEarned2, lifetimeParsnipSpent2, parsnipsPerSecond2)
        await buildUserData(true, userCredentials3.id, powerUpActive1.id, parsnipBalance3, parsnipsPerClick3, lifetimeClicks3, lifetimeParsnipEarned3, lifetimeParsnipSpent3, parsnipsPerSecond3)

        const result: UserLeaderboard[] = await userDataService.getUserLeaderboard("parsnipsPerClick" as leaderboardSortBy, 3)

        expect(result.length).toEqual(3)
        expect(result[0].place).toEqual(1)
        expect(result[1].place).toEqual(2)
        expect(result[2].place).toEqual(3)
        expect(result[0].parsnipsPerClick).toBeGreaterThanOrEqual(result[1].parsnipsPerClick)
        expect(result[1].parsnipsPerClick).toBeGreaterThanOrEqual(result[2].parsnipsPerClick)
        expect(result[0].sortedBy).toEqual("parsnipsPerClick")

        const result2: UserLeaderboard[] = await userDataService.getUserLeaderboard("parsnipsPerClick" as leaderboardSortBy, 2)
        expect(result2.length).toEqual(2)
    })

    it("Purchasing a passive powerup, should purchase it, decrease balance and increase parsnipsPerClick if user can afford it", async () => {

        const userCredentials: UserCredentials = await buildUserCredentials(userName1, email1, password1)
        const powerUpPassive1: PowerupPassive = await buildPowerupPassive(powerupName1)
        const userData: UserData = await buildUserData(false, userCredentials.id, powerUpPassive1.id, parsnipBalance1, parsnipsPerClick1, lifetimeClicks1, lifetimeParsnipEarned1, lifetimeParsnipSpent1, parsnipsPerSecond1)

        const result1: boolean = await userDataService.purchasePowerupPassive(userCredentials.id, powerUpPassive1.id)
        expect(result1).toBeFalsy()

        let balance: number = userData.parsnipBalance
        for (let i = 0; i < 10; i++)
            balance = await userDataService.incrementParsnip(userCredentials.id)

        await expect(userDataService.purchasePowerupPassive(userCredentials.id, userData.id)).rejects.toThrow()
        await expect(userDataService.purchasePowerupPassive(userData.id, powerUpPassive1.id)).rejects.toThrow()

        const result2: boolean = await userDataService.purchasePowerupPassive(userCredentials.id, powerUpPassive1.id)
        const userData2: UserData = await userDataService.getUserData(userCredentials.id)

        expect(result2).toBeTruthy()
        expect(userData2.parsnipBalance).toEqual(balance - PowerupPriceHelpers.computePrice(powerUpPassive1.basePrice, powerUpPassive1.increment, powerup1PurchaseCount))
        expect(userData2.parsnipsPerSecond).toEqual(userData.parsnipsPerSecond + powerUpPassive1.parsnipsPerSecond)
        expect(userData2.powerupsPassivePurchased.find(pap => pap.idPowerup.toString() === powerUpPassive1.id.toString())).toBeDefined()
        expect(userData2.powerupsPassivePurchased.find(pap => pap.idPowerup.toString() === powerUpPassive1.id.toString())!.purchaseCount)
            .toEqual(userData.powerupsPassivePurchased.find(pap => pap.idPowerup.toString() === powerUpPassive1.id.toString())!.purchaseCount + 1)
        expect(userData2.lifetimeParsnipsSpent).toEqual(userData.lifetimeParsnipsSpent + PowerupPriceHelpers.computePrice(powerUpPassive1.basePrice, powerUpPassive1.increment, powerup1PurchaseCount))
    })
})
