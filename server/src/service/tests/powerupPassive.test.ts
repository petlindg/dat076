import {describe} from "node:test";
import {userCredentialsModel} from "../../db/userCredentials.db";
import {UserCredentials} from "../../model/userCredentials";
import {userDataModel} from "../../db/userData.db";
import {UserData} from "../../model/userData";
import {PowerupPriceHelpers} from "../../helpers/powerupPriceHelpers";
import {powerupPassiveModel} from "../../db/powerupPassive.db";
import {TestHelpers} from "../../helpers/testHelpers";
import {IPowerupPassiveService} from "../interfaces/powerupPassive.interface";
import {PowerupPassiveService} from "../powerupPassive";
import {PowerupPassiveResponseModel} from "../../model/powerupPassiveResponseModel";
import {PowerupPassive} from "../../model/powerupPassive";

afterEach(TestHelpers.TearDownAllCollections)

jest.mock("../../db/conn")
const powerupPassiveService: IPowerupPassiveService = new PowerupPassiveService()
describe("Powerup Active Service tests", () => {

    const userName: string = "TestUserName";
    const email: string = "noumailcist@email.com";
    const password: string = "plzencodeme";
    const parsnipPerClick: 1 = 1;
    const parsnipsPerSecond: 0 = 0;
    const parsnipBalance: 0 = 0;

    it("Getting all powerups passive, should return the powerups in correct order, with correct prices for a given user", async () => {
        const userCredentials: UserCredentials = await (await userCredentialsModel).create({
            userName: userName,
            email: email,
            password: password,
        })

        const powerUpPassive1: PowerupPassive = await (await powerupPassiveModel).create({
            powerupName: "a",
            basePrice: 500,
            increment: 1,
            parsnipsPerSecond: 1
        })

        const powerUpPassive2: PowerupPassive = await (await powerupPassiveModel).create({
            powerupName: "b",
            basePrice: 10,
            increment: 0.1,
            parsnipsPerSecond: 0.1
        })

        const powerUpPassive3: PowerupPassive = await (await powerupPassiveModel).create({
            powerupName: "c",
            basePrice: 100,
            increment: 0.20,
            parsnipsPerSecond: 0.25
        })

        const userData: UserData = await (await userDataModel).create({
            credentialsId: userCredentials.id,
            parsnipBalance: parsnipBalance,
            parsnipsPerClick: parsnipPerClick,
            parsnipsPerSecond: parsnipsPerSecond,
            powerupsActivePurchased: [],
            powerupsPassivePurchased: [
                {idPowerup: powerUpPassive1.id, purchaseCount: 5},
                {idPowerup: powerUpPassive3.id, purchaseCount: 100}
            ],
        })

        await expect(powerupPassiveService.getPowerupPassiveList(userData.id)).rejects.toThrow()

        const result: PowerupPassiveResponseModel[] = await powerupPassiveService.getPowerupPassiveList(userCredentials.id)

        expect(result.length).toEqual(3)
        expect(result[0].powerupName).toEqual("b")
        expect(result[1].powerupName).toEqual("c")
        expect(result[2].powerupName).toEqual("a")
        expect(result[0].priceForUser).toEqual(PowerupPriceHelpers.computePrice(powerUpPassive2.basePrice, powerUpPassive2.increment, 0))
        expect(result[1].priceForUser).toEqual(PowerupPriceHelpers.computePrice(powerUpPassive3.basePrice, powerUpPassive3.increment, 100))
        expect(result[2].priceForUser).toEqual(PowerupPriceHelpers.computePrice(powerUpPassive1.basePrice, powerUpPassive1.increment, 5))
    })

})
