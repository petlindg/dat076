import * as SuperTest from "supertest";
import {Response} from "supertest";
import {app} from "./start";
import {describe} from "node:test";
import {userCredentialsModel} from "./db/userCredentials.db";
import {userDataModel} from "./db/userData.db";

const request: any = SuperTest.agent(app);

jest.mock("./db/conn")
afterEach(async (): Promise<void> => {
    await (await userCredentialsModel).deleteMany()
    await (await userDataModel).deleteMany()
})
describe("End-to-end tests", () => {

    it("Auth end-to-end test", async () => {
        const username: string = "TheTestGuy"
        const mail: string = "thetestguy@jest.com"
        const password: string = "besterJester123"

        // login without registering
        const res1: Response = await request.post("/auth/login").send({email: mail, password: password})
        expect(res1.statusCode).toEqual(401)

        // register with invalid form of credentials
        const res2: Response = await request.post("/auth/register").send({email: "", password: password, username: username})
        expect(res2.statusCode).toEqual(400)

        // register
        const res3: Response = await request.post("/auth/register").send({email: mail, password: password, username: username})
        expect(res3.statusCode).toEqual(201)

        // check if logged in
        const res4 : Response = await request.get("/auth").send()
        expect(res4.statusCode).toEqual(200)

        // try to register when already logged in
        const res5: Response = await request.post("/auth/register").send({email: mail, password: password, username: username})
        expect(res5.statusCode).toEqual(403)

        // logout
        const res6: Response = await request.delete("/auth/logout").send()
        expect(res6.statusCode).toEqual(200)

        // login with invalid credentials
        const res7: Response = await request.post("/auth/login").send({email: mail, password: "wrongpass"})
        expect(res7.statusCode).toEqual(401)

        // login
        const res8: Response = await request.post("/auth/login").send({email: mail, password: password})
        expect(res8.statusCode).toEqual(200)

        // check if logged in
        const res9 : Response = await request.get("/auth").send()
        expect(res9.statusCode).toEqual(200)

        // logout
        const res10: Response = await request.delete("/auth/logout").send()
        expect(res10.statusCode).toEqual(200)
    })

})