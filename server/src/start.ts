import express from "express";
import { userRouter } from "./router/user";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);