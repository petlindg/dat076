import {userCredentialsModel} from "../../db/userCredentials.db";
import {IUserDataService} from "../interfaces/userData.interface";
import {UserDataService} from "../userData";
import {userDataModel} from "../../db/userData.db";
import {powerupActiveModel} from "../../db/powerupActive.db";
import {UserCredentials} from "../../model/userCredentials";
import {UserData, UserStatistics} from "../../model/userData";
import {PowerupActive} from "../../model/powerupActive";
import {ObjectId} from "mongodb";
import {PowerupPriceHelpers} from "../../helpers/powerupPriceHelpers";

afterEach(async (): Promise<void> => {
    await (await userCredentialsModel).deleteMany()
    await (await userDataModel).deleteMany()
    await (await powerupActiveModel).deleteMany()
})

jest.mock("../../db/conn")
const userDataService: IUserDataService = new UserDataService()

const userName: string = "TestUserName";
const email: string = "noumailcist@email.com";
const password: string = "plzencodeme";
const parsnipsPerClickUser: 7 = 7;
const parsnipBalance: 2 = 2;
const lifetimeClicks: number = 100;
const lifetimeParsnipEarned: number = 236;
const lifetimeParsnipSpent: number = 54;
const powerupName1: string = "a";
const powerupName2: string = "b";
const powerupName3: string = "c";
const basePrice: number = 10;
const increment: number = 0.15;
const parsnipsPerClickPowerup: number = 3;
const powerup1PurchaseCount: number = 2;
const powerup2PurchaseCount: number = 4;
const powerup3PurchaseCount: number = 6;

async function buildUserCredentials(): Promise<UserCredentials> {
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

async function buildUserData(ucId: ObjectId, paId: ObjectId): Promise<UserData> {
    return await (await userDataModel).create({
        credentialsId: ucId,
        parsnipBalance: parsnipBalance,
        parsnipsPerClick: parsnipsPerClickUser,
        powerupsActivePurchased: [
            {idPowerup: paId, purchaseCount: powerup1PurchaseCount},
        ],
        powerupsPassivePurchased: [],
        lifetimeClicks: 100,
        lifetimeParsnipsEarned: 236,
        lifetimeParsnipsSpent: 54,
    })
}

describe("User Data Service tests", () => {


    it("Getting user data should return correct user data", async () => {

        const userCredentials: UserCredentials = await buildUserCredentials()
        const powerUpActive1: PowerupActive = await buildPowerupActive(powerupName1)
        const userData: UserData = await buildUserData(userCredentials.id, powerUpActive1.id)

        await expect(userDataService.getUserData(userData.id)).rejects.toThrow()

        const result: UserData = await userDataService.getUserData(userCredentials.id)

        expect(result.id).toEqual(userData.id)
        expect(result.credentialsId.toString()).toEqual(userCredentials.id.toString())
        expect(result.parsnipBalance).toEqual(parsnipBalance)
        expect(result.parsnipsPerClick).toEqual(parsnipsPerClickUser)
        expect(result.powerupsActivePurchased.length).toEqual(1)
        expect(result.powerupsActivePurchased[0].idPowerup.toString()).toEqual(powerUpActive1.id.toString())
        expect(result.powerupsActivePurchased[0].purchaseCount).toEqual(powerup1PurchaseCount)
        expect(result.powerupsPassivePurchased).toEqual([])
        expect(result.lifetimeClicks).toEqual(lifetimeClicks)
        expect(result.lifetimeParsnipsEarned).toEqual(lifetimeParsnipEarned)
        expect(result.lifetimeParsnipsSpent).toEqual(lifetimeParsnipSpent)
    });

    it("Incrementing user parsnip should increase their balance by their parsnip per click", async () => {

        const userCredentials: UserCredentials = await buildUserCredentials()
        const powerUpActive1: PowerupActive = await buildPowerupActive(powerupName1)
        const userData: UserData = await buildUserData(userCredentials.id, powerUpActive1.id)

        await expect(userDataService.getUserData(powerUpActive1.id)).rejects.toThrow()

        const result: number = await userDataService.incrementParsnip(userCredentials.id)
        const newUserData: UserData = await userDataService.getUserData(userCredentials.id)

        expect(newUserData.parsnipBalance).toEqual(userData.parsnipBalance + userData.parsnipsPerClick)
        expect(newUserData.lifetimeClicks).toEqual(userData.lifetimeClicks + 1)
        expect(newUserData.lifetimeParsnipsEarned).toEqual(userData.lifetimeParsnipsEarned + userData.parsnipsPerClick)
        expect(result).toEqual(newUserData.parsnipBalance)
    })

    it("Buying a powerup should reduce the user's balance by its price and increase the user's parsnipsPerClick by the powerup's parsnips per click, if the user can afford it", async () => {

        const userCredentials: UserCredentials = await buildUserCredentials()
        const powerUpActive1: PowerupActive = await buildPowerupActive(powerupName1)
        const userData: UserData = await buildUserData(userCredentials.id, powerUpActive1.id)

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
        const userCredentials: UserCredentials = await buildUserCredentials()
        const powerUpActive1: PowerupActive = await buildPowerupActive(powerupName1)
        const powerUpActive2: PowerupActive = await buildPowerupActive(powerupName2)
        const powerUpActive3: PowerupActive = await buildPowerupActive(powerupName3)
        await (await userDataModel).create({
            credentialsId: userCredentials.id,
            parsnipBalance: parsnipBalance,
            parsnipsPerClick: parsnipsPerClickUser,
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
        expect(userStatistics.lifetimeClicks).toEqual(lifetimeClicks)
        expect(userStatistics.lifetimeParsnipsEarned).toEqual(lifetimeParsnipEarned)
        expect(userStatistics.lifetimeParsnipsSpent).toEqual(lifetimeParsnipSpent)
        expect(userStatistics.parsnipsPerClick).toEqual(parsnipsPerClickUser)
        expect(userStatistics.parsnipBalance).toEqual(parsnipBalance)
        expect(userStatistics.totalPowerupsPurchased).toEqual(powerup1PurchaseCount + powerup2PurchaseCount + powerup3PurchaseCount)

    })
})
