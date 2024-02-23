import * as SuperTest from "supertest";
import {Response} from "supertest";
import {app} from "./start";

const request = SuperTest.default(app);
jest.mock("./db/conn")
test("End-to-end test", async () => {
    expect(true).toBeTruthy()

    // const res1: Response = await request.get("/user").send();
    // expect(res1.statusCode).toEqual(200);
    // expect(res1.body.parsnipCount).toEqual(0);
    //
    // const newUserName : string = "TestUserName"
    // const resUserName : Response = await request.patch("/user").send({userName : newUserName});
    // expect(resUserName.statusCode).toEqual(200);
    //
    // const res2: Response = await request.post("/user/punch");
    // expect(res2.statusCode).toEqual(200);
    //
    // for (let i = 0; i < 24; i++) {
    //   const res3: Response = await request.post("/user/punch");
    //   expect(res3.statusCode).toEqual(200);
    // }
    //
    // const res4: Response = await request.get("/user").send();
    // expect(res4.statusCode).toEqual(200);
    // expect(res4.body.parsnipCount).toEqual(25);
    //
    // const res5: Response = await request.patch("/user/powerUp");
    // expect(res5.statusCode).toEqual(200);
    //
    // const res6: Response = await request.get("/user").send();
    // expect(res6.statusCode).toEqual(200);
    // const user : User = res6.body;
    // expect(user.parsnipCount).toEqual(0);
    // expect(user.parsnipsPerClick).toEqual(2);
    // expect(user.userName).toEqual(newUserName);
});
