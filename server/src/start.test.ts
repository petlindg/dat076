import * as SuperTest from "supertest";
import { Response } from "supertest";
import { app } from "./start";

const request = SuperTest.default(app);

test("End-to-end test", async () => {
  const res1: Response = await request.get("/user").send();
  expect(res1.statusCode).toEqual(200);
  expect(res1.body.parsnipCount).toEqual(0);

  const res2: Response = await request.post("/user");
  expect(res2.statusCode).toEqual(200);

  for (let i = 0; i < 24; i++) {
    const res3: Response = await request.post("/user");
    expect(res3.statusCode).toEqual(200);
  }

  const res4: Response = await request.get("/user").send();
  expect(res4.statusCode).toEqual(200);
  expect(res4.body.parsnipCount).toEqual(25);

  const res5: Response = await request.patch("/user");
  expect(res5.statusCode).toEqual(200);

  const res6: Response = await request.get("/user").send();
  expect(res6.statusCode).toEqual(200);
  expect(res6.body.parsnipCount).toEqual(0);
  expect(res6.body.parsnipsPerClick).toEqual(2);
});
