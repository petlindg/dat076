import {userCredentialsModel} from "../../db/userCredentials.db";
import {IUserDataService} from "../interfaces/userData.interface";
import {UserDataService} from "../userData";
import {userDataModel} from "../../db/userData.db";
import {powerupActiveModel} from "../../db/powerupActive.db";
import {UserCredentials} from "../../model/userCredentials";
import {UserData} from "../../model/userData";
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
const powerupName: string = "a";
const basePrice: number = 10;
const increment: number = 0.15;
const parsnipsPerClickPowerup: number = 3;
const powerup1PurchaseCount: number = 2;

async function buildUserCredentials(): Promise<UserCredentials> {
    return await (await userCredentialsModel).create({
        userName: userName,
        email: email,
        password: password,
    })
}

async function buildPowerupActive(): Promise<PowerupActive> {
    return await (await powerupActiveModel).create({
        powerupName: powerupName,
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
    })
}

describe("User Data Service tests", () => {


    it("Getting user data should return correct user data", async () => {

        const userCredentials: UserCredentials = await buildUserCredentials()
        const powerUpActive1: PowerupActive = await buildPowerupActive()
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
    });

    it("Incrementing user parsnip should increase their balance by their parsnip per click", async () => {

        const userCredentials: UserCredentials = await buildUserCredentials()
        const powerUpActive1: PowerupActive = await buildPowerupActive()
        const userData: UserData = await buildUserData(userCredentials.id, powerUpActive1.id)

        await expect(userDataService.getUserData(powerUpActive1.id)).rejects.toThrow()

        const result: number = await userDataService.incrementParsnip(userCredentials.id)
        const newUserData: UserData = await userDataService.getUserData(userCredentials.id)

        expect(newUserData.parsnipBalance).toEqual(userData.parsnipBalance + userData.parsnipsPerClick)
        expect(result).toEqual(newUserData.parsnipBalance)
    })

    it("Buying a powerup should reduce the user's balance by its price and increase the user's parsnipsPerClick by the powerup's parsnips per click, if the user can afford it", async () => {

        const userCredentials: UserCredentials = await buildUserCredentials()
        const powerUpActive1: PowerupActive = await buildPowerupActive()
        const userData: UserData = await buildUserData(userCredentials.id, powerUpActive1.id)

        const result1: boolean = await userDataService.purchasePowerupActive(userCredentials.id, powerUpActive1.id)
        expect(result1).toBeFalsy()

        let balance : number = userData.parsnipBalance
        for(let i = 0; i < 10; i++)
            balance = await userDataService.incrementParsnip(userCredentials.id)

        await expect(userDataService.purchasePowerupActive(userCredentials.id, userData.id)).rejects.toThrow()
        await expect(userDataService.purchasePowerupActive(userData.id, powerUpActive1.id)).rejects.toThrow()

        const result2 : boolean = await userDataService.purchasePowerupActive(userCredentials.id, powerUpActive1.id)
        const userData2 : UserData = await userDataService.getUserData(userCredentials.id)

        expect(result2).toBeTruthy()
        expect(userData2.parsnipBalance).toEqual(balance - PowerupPriceHelpers.computePrice(powerUpActive1.basePrice, powerUpActive1.increment, powerup1PurchaseCount))
        expect(userData2.parsnipsPerClick).toEqual(userData.parsnipsPerClick + powerUpActive1.parsnipsPerClick)
        expect(userData2.powerupsActivePurchased.find(pap => pap.idPowerup.toString() === powerUpActive1.id.toString())).toBeDefined()
        expect(userData2.powerupsActivePurchased.find(pap => pap.idPowerup.toString() === powerUpActive1.id.toString())!.purchaseCount)
            .toEqual(userData.powerupsActivePurchased.find(pap => pap.idPowerup.toString() === powerUpActive1.id.toString())!.purchaseCount + 1)
    })
})
