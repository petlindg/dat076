import * as SuperTest from "supertest";
import {Response} from "supertest";
import {app} from "./start";
import {describe} from "node:test";
import {userCredentialsModel} from "./db/userCredentials.db";
import {userDataModel} from "./db/userData.db";
import {PowerupActive} from "./model/powerupActive";
import {powerupActiveModel} from "./db/powerupActive.db";
import TestAgent from "supertest/lib/agent";
import {PowerupPriceHelpers} from "./helpers/powerupPriceHelpers";
import {PowerupPassive} from "./model/powerupPassive";
import {powerupPassiveModel} from "./db/powerupPassive.db";

const request: TestAgent = SuperTest.agent(app);

jest.mock("./db/conn")
afterEach(async (): Promise<void> => {
    await (await userCredentialsModel).deleteMany()
    await (await userDataModel).deleteMany()
    await (await powerupActiveModel).deleteMany()
})
describe("End-to-end tests", () => {

    async function buildPowerupActive(name: string, basePrice: number, parsnipsPerClick: number): Promise<PowerupActive> {
        return await (await powerupActiveModel).create({
            powerupName: name,
            basePrice: basePrice,
            increment: 0.15,
            parsnipsPerClick: parsnipsPerClick
        })
    }

    async function buildPowerupPassive(name: string, basePrice: number, parsnipsPerSecond: number): Promise<PowerupPassive> {
        return await (await powerupPassiveModel).create({
            powerupName: name,
            basePrice: basePrice,
            increment: 0.15,
            parsnipsPerSecond: parsnipsPerSecond
        })
    }

    const username: string = "TheTestGuy"
    const mail: string = "thetestguy@jest.com"
    const password: string = "besterJester123"
    const newUsername: string = "TheJestGuy"

    //powerupActive1
    const name1a = "a"
    const basePrice1a = 10
    const parsnipPerClick1a = 1

    //powerupPassive1
    const name1p = "p"
    const basePrice1p = 25
    const parsnipsPerSecond1p = 0.1

    it("Auth end-to-end test", async () => {

        // login without registering
        const res1: Response = await request.post("/auth/login").send({email: mail, password: password})
        expect(res1.statusCode).toEqual(403)

        // register with invalid form of credentials
        const res2: Response = await request.post("/auth/register").send({
            email: "",
            password: password,
            username: username
        })
        expect(res2.statusCode).toEqual(400)

        // register
        const res3: Response = await request.post("/auth/register").send({
            email: mail,
            password: password,
            username: username
        })
        expect(res3.statusCode).toEqual(201)

        // check if logged in
        const res4: Response = await request.get("/auth").send()
        expect(res4.statusCode).toEqual(200)
        expect(res4.body).toBeTruthy()

        // try to register when already logged in
        const res5: Response = await request.post("/auth/register").send({
            email: mail,
            password: password,
            username: username
        })
        expect(res5.statusCode).toEqual(403)

        // logout
        const res6: Response = await request.delete("/auth/logout").send()
        expect(res6.statusCode).toEqual(200)

        // login with invalid credentials
        const res7: Response = await request.post("/auth/login").send({email: mail, password: "wrongpass"})
        expect(res7.statusCode).toEqual(403)

        // login
        const res8: Response = await request.post("/auth/login").send({email: mail, password: password})
        expect(res8.statusCode).toEqual(200)

        // check if logged in
        const res9: Response = await request.get("/auth").send()
        expect(res9.statusCode).toEqual(200)

        // logout
        const res10: Response = await request.delete("/auth/logout").send()
        expect(res10.statusCode).toEqual(200)
    })

    it("Register and gameplay with stats retrieval end-to-end test", async () => {

        // attempt access without logging in
        const res0: Response = await request.patch("/userCredentials").send({newUsername: newUsername})
        expect(res0.statusCode).toEqual(401)

        // register
        const res1: Response = await request.post("/auth/register").send({
            email: mail,
            password: password,
            username: username
        })
        expect(res1.statusCode).toEqual(201)

        // update username
        const res2: Response = await request.patch("/userCredentials").send({newUsername: newUsername})
        expect(res2.statusCode).toEqual(200)

        // check your user credentials with updated username
        const res3: Response = await request.get("/userCredentials").send()
        expect(res3.statusCode).toEqual(200)
        expect(res3.body.userName).toEqual(newUsername)
        expect(res3.body.email).toEqual(mail)

        // attempt to purchase a non-existing active powerup
        const res4: Response = await request.post("/userData/purchaseActivePowerUp").send({powerupActiveId: res3.body._id})
        expect(res4.statusCode).toEqual(404)

        // add an active powerup
        const powerupActive: PowerupActive = await buildPowerupActive(name1a, basePrice1a, parsnipPerClick1a)

        // attempt to purchase an active powerup when you can not afford it
        const res5: Response = await request.post("/userData/purchaseActivePowerUp").send({powerupActiveId: powerupActive.id})
        expect(res5.statusCode).toEqual(403)

        // click parsnip 30 times
        for (let i = 0; i < 30; i++) {
            const resClick: Response = await request.post("/userData/incrementParsnip").send()
            expect(resClick.statusCode).toEqual(200)
        }

        // purchase the active powerup, this time with enough balance
        const res6: Response = await request.post("/userData/purchaseActivePowerUp").send({powerupActiveId: powerupActive.id})
        expect(res6.statusCode).toEqual(200)

        //--------------//

        // attempt to purchase a non-existing passive powerup
        const res7: Response = await request.post("/userData/purchasePassivePowerUp").send({powerupPassiveId: res3.body._id})
        expect(res7.statusCode).toEqual(404)

        // add a passive powerup
        const powerupPassive: PowerupPassive = await buildPowerupPassive(name1p, basePrice1p, parsnipsPerSecond1p)

        // attempt to purchase a passive powerup when you can not afford it
        const res8: Response = await request.post("/userData/purchasePassivePowerUp").send({powerupPassiveId: powerupPassive.id})
        expect(res8.statusCode).toEqual(403)

        // click parsnip 30 times
        for (let i = 0; i < 30; i++) {
            const resClick: Response = await request.post("/userData/incrementParsnip").send()
            expect(resClick.statusCode).toEqual(200)
        }

        // purchase the passive powerup, this time with enough balance
        const res9: Response = await request.post("/userData/purchasePassivePowerUp").send({powerupPassiveId: powerupPassive.id})
        expect(res9.statusCode).toEqual(200)

        // get your user data
        const res10: Response = await request.get("/userData").send()
        expect(res10.statusCode).toEqual(200)
        expect(res10.body.parsnipsPerClick).toEqual(parsnipPerClick1a + 1)
        expect(res10.body.parsnipsPerSecond).toEqual(parsnipsPerSecond1p)
        expect(res10.body.parsnipBalance).toEqual(30 + (30*(parsnipPerClick1a+1)) - basePrice1a - basePrice1p)
        expect(res10.body.powerupsActivePurchased).toEqual([{idPowerup: powerupActive.id.toString(), purchaseCount: 1}])
        expect(res10.body.powerupsPassivePurchased).toEqual([{idPowerup: powerupPassive.id.toString(), purchaseCount: 1}])
        expect(res10.body.lifetimeClicks).toEqual(60)
        expect(res10.body.lifetimeParsnipsEarned).toEqual(30 + (30*(parsnipPerClick1a+1)))
        expect(res10.body.lifetimeParsnipsSpent).toEqual(basePrice1a + basePrice1p)

        // get your statistics
        const res11: Response = await request.get("/userData/statistics").send()
        expect(res11.statusCode).toEqual(200)
        expect(res11.body.totalPowerupsPurchased).toEqual(2)

        // get the leaderboard
        const res12: Response = await request.get("/userData/leaderboard").query({sortBy: "parsnipsPerClick", limit:"10"}).send()
        expect(res12.statusCode).toEqual(200)
        expect(res12.body.length).toEqual(1)
        expect(res12.body[0].sortedBy).toEqual("parsnipsPerClick")

        // get the leaderboard with invalid query
        const res13: Response = await request.get("/userData/leaderboard").query({sortBy: "ppc", limit:"10"}).send()
        expect(res13.statusCode).toEqual(400)

        // get list of available powerups
        const res14: Response = await request.get("/powerUpActive").send()
        expect(res14.statusCode).toEqual(200)
        expect(res14.body.length).toEqual(1)
        expect(res14.body[0].powerupName).toEqual(name1a)
        expect(res14.body[0].priceForUser).toEqual(PowerupPriceHelpers.computePrice(basePrice1a, 0.15, 1))

        // logout
        const res15: Response = await request.delete("/auth/logout").send()
        expect(res15.statusCode).toEqual(200)

        // attempt access without logging in
        const res16: Response = await request.patch("/userCredentials").send({newUsername: newUsername})
        expect(res16.statusCode).toEqual(401)
    })

})