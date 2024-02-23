import express, {Request, Response, Router} from "express";
import {UserCredentials} from "../model/userCredentials";
import {IUserCredentialsService} from "../service/interfaces/IuserCredentials";
import {UserCredentialsService} from "../service/userCredentials";
import {StringHelpers} from "../helpers/stringHelpers";
import {ObjectId} from "mongodb";

const userCredentialsService: IUserCredentialsService =
    new UserCredentialsService();

const userId = new ObjectId("65d75e0b5df275c5654b67a3"); // TODO get form cookies

export const userCredentialsRouter: Router = express.Router();

userCredentialsRouter.get(
    "/",
    async (_, res: Response<UserCredentials | string>) => {
        try {
            const userCredentials: UserCredentials =
                await userCredentialsService.getUserCredentials(userId);

            res.status(200).send(userCredentials);
        } catch (error: any) {
            res.status(500).send(error.message ?? error)
        }
    },
);

userCredentialsRouter.patch(
    "/",
    async (
        req: Request<{}, {}, { newUsername: string }>,
        res: Response<string>,
    ) => {
        try {
            if (StringHelpers.isNullOrEmpty(req.body.newUsername)) {
                res
                    .status(400)
                    .send("Invalid username, username can not be null or empty");
                return
            }

            const success: boolean = await userCredentialsService.changeUsername(
                userId,
                req.body.newUsername,
            );

            if (success) res.status(200).send("Successfully updated username");
            else
                res
                    .status(500)
                    .send("Unknown error occurred while calling userCredentialsService");
        } catch (error: any) {
            res.status(500).send(error.message ?? error)
        }
    },
);
