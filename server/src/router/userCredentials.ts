import express, { Request, Response, Router } from "express";
import { UserCredentials } from "../model/userCredentials";
import { IUserCredentialsService } from "../service/interfaces/IuserCredentials";
import { UserCredentialsService } from "../service/userCredentials";
import { StringHelpers } from "../helpers/stringHelpers";

const userCredentialsService: IUserCredentialsService =
  new UserCredentialsService();

export const userCredentialsRouter: Router = express.Router();

userCredentialsRouter.get(
  "/",
  async (_, res: Response<UserCredentials | string>) => {
    try {
      const userCredentials: UserCredentials | null =
        await userCredentialsService.getUserCredentials();

      if (userCredentials === null) {
        res.status(404).send("User not found");
        return;
      }

      res.status(200).send(userCredentials);
    } catch (error: any) {
      res.status(500).send(error.message);
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
      }

      const success: boolean = await userCredentialsService.changeUsername(
        req.body.newUsername,
      );

      if (success) res.status(200).send("Successfully updated username");
      else
        res
          .status(500)
          .send("Unknown error occureed while calling userCredentialsService");
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  },
);
