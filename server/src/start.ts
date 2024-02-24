import express from "express";
import cors from "cors";
import {userCredentialsRouter} from "./router/userCredentials";
import {userDataRouter} from "./router/userData";
import {powerupActiveRouter} from "./router/powerupActive";
import session from "express-session";
import {ObjectId} from "mongodb";
import {authRouter} from "./router/auth";
import {authMiddleware} from "./middleware/auth";

const env = require("../env.json");

declare module "express-session" {
    interface SessionData {
        user: {
            id: ObjectId
        }
    }
}

export const app = express();

app.use(express.json());

app.use(session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false
}))

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(authMiddleware)

app.get("/", (_, res) => res.status(200).send("Server running...  :)"));
app.use("/userCredentials", userCredentialsRouter);
app.use("/userData", userDataRouter);
app.use("/powerupActive", powerupActiveRouter);
app.use("/auth", authRouter)