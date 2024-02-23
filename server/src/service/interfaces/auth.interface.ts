import {LoginModel, RegisterModel} from "../../model/auth";
import {ObjectId} from "mongodb";

export interface IAuthService {

    /**
     * Creates a new user (credentials and data)
     * @param registerModel credentials for the new user
     * @returns Promise<ObjectId> - id of newly created user, should be written to the session
     * @throws Error in case of duplicate user credentials
     */
    register(registerModel: RegisterModel): Promise<ObjectId>

    /**
     * Validates login information and provides id to login
     * @param loginModel credentials of an existing user
     * @returns Promise<ObjectId> - id of user to login
     * @throws Error if user does not exist in the db
     */
    login(loginModel: LoginModel): Promise<ObjectId>
}