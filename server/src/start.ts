import express from "express";
import { userRouter } from "./router/user";
import cors from "cors";
import { userCredentialsRouter } from "./router/userCredentials";

export const app = express();

app.use(express.json());
app.use(cors());
app.get("/", (_, res) => res.status(200).send("Server running...  :)"));
app.use("/user", userRouter);
app.use("/userCredentials", userCredentialsRouter);
