import {describe} from "node:test";
import {userCredentialsModel} from "../../db/userCredentials.db";
import {PowerupActiveService} from "../powerupActive";
import {IPowerupActiveService} from "../interfaces/powerupActive.interface";
import {UserCredentials} from "../../model/userCredentials";
import {userDataModel} from "../../db/userData.db";
import {UserData} from "../../model/userData";
import {PowerupActive} from "../../model/powerupActive";
import {powerupActiveModel} from "../../db/powerupActive.db";
import {PowerupActiveResponseModel} from "../../model/powerupActiveResponseModel";
import {PowerupPriceHelpers} from "../../helpers/powerupPriceHelpers";

afterEach(async (): Promise<void> => {
    await (await userCredentialsModel).deleteMany()
    await (await userDataModel).deleteMany()
    await (await powerupActiveModel).deleteMany()
})

jest.mock("../../db/conn")
const powerupActiveService: IPowerupActiveService = new PowerupActiveService()
describe("Powerup Active Service tests", () => {

    const userName: string = "TestUserName";
    const email: string = "noumailcist@email.com";
    const password: string = "plzencodeme";
    const parsnipPerClick: 1 = 1;
    const parsnipBalance: 0 = 0;

    it("Getting all powerups active, should return the powerups in correct order, with correct prices for a given user", async () => {
        const userCredentials: UserCredentials = await (await userCredentialsModel).create({
            userName: userName,
            email: email,
            password: password,
        })

        const powerUpActive1: PowerupActive = await (await powerupActiveModel).create({
            powerupName: "a",
            basePrice: 500,
            increment: 1,
            parsnipsPerClick: 10
        })

        const powerUpActive2: PowerupActive = await (await powerupActiveModel).create({
            powerupName: "b",
            basePrice: 10,
            increment: 0.1,
            parsnipsPerClick: 1
        })

        const powerUpActive3: PowerupActive = await (await powerupActiveModel).create({
            powerupName: "c",
            basePrice: 100,
            increment: 0.20,
            parsnipsPerClick: 3
        })

        const userData: UserData = await (await userDataModel).create({
            credentialsId: userCredentials.id,
            parsnipBalance: parsnipBalance,
            parsnipsPerClick: parsnipPerClick,
            powerupsActivePurchased: [
                {idPowerup: powerUpActive1.id, purchaseCount: 5},
                {idPowerup: powerUpActive3.id, purchaseCount: 100}
            ],
            powerupsPassivePurchased: [],
        })

        await expect(powerupActiveService.getPowerupActiveList(userData.id)).rejects.toThrow()

        const result: PowerupActiveResponseModel[] = await powerupActiveService.getPowerupActiveList(userCredentials.id)

        expect(result.length).toEqual(3)
        expect(result[0].powerupName).toEqual("b")
        expect(result[1].powerupName).toEqual("c")
        expect(result[2].powerupName).toEqual("a")
        expect(result[0].priceForUser).toEqual(PowerupPriceHelpers.computePrice(powerUpActive2.basePrice, powerUpActive2.increment, 0))
        expect(result[1].priceForUser).toEqual(PowerupPriceHelpers.computePrice(powerUpActive3.basePrice, powerUpActive3.increment, 100))
        expect(result[2].priceForUser).toEqual(PowerupPriceHelpers.computePrice(powerUpActive1.basePrice, powerUpActive1.increment, 5))
    })

})
