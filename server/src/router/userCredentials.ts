import express, {Request, Response, Router} from "express";
import {UserCredentials} from "../model/userCredentials";
import {IUserCredentialsService} from "../service/interfaces/userCredentials.interface";
import {UserCredentialsService} from "../service/userCredentials";
import {StringHelpers} from "../helpers/stringHelpers";
import {ObjectId} from "mongodb";

const userCredentialsService: IUserCredentialsService =
    new UserCredentialsService();

export const userCredentialsRouter: Router = express.Router();

userCredentialsRouter.get(
    "/",
    async (req, res: Response<UserCredentials | string>) => {
        try {
            const userId: ObjectId = req.session.user!.id
            const userCredentials: UserCredentials =
                await userCredentialsService.getUserCredentials(userId);

            res.status(200).send(userCredentials);
        } catch (error: any) {
            res.status(error.statusCode ?? 500).send(error.message ?? error)
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

            const userId: ObjectId = req.session.user!.id

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
                res.status(500).send("Unknown error occurred while calling userCredentialsService");

        } catch (error: any) {
            res.status(error.statusCode ?? 500).send(error.message ?? error)
        }
    },
);
