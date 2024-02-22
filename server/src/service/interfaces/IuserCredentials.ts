import { UserCredentials } from "../model/userCredentials";

export interface IUserCredentialsService {
  // Returns user credentials of the user sending the request, null if the user does not exist (shouldn't happen)
  getUserCredentials(): Promise<UserCredentials | null>;

  // Changes the username of the user sending to request to `newUsername`, returns true on success
  changeUsername(newUsername: string): Promise<boolean>;
}
