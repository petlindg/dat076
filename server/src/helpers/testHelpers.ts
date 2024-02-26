import {powerupActiveModel} from "../db/powerupActive.db";
import {powerupPassiveModel} from "../db/powerupPassive.db";
import {userCredentialsModel} from "../db/userCredentials.db";
import {userDataModel} from "../db/userData.db";

export class TestHelpers {
    /**
     * Tears down all collections, should be used in the afterEach function's callback
     */
    static async TearDownAllCollections(): Promise<void>{
        await (await userCredentialsModel).deleteMany()
        await (await userDataModel).deleteMany()
        await (await powerupActiveModel).deleteMany()
        await (await powerupPassiveModel).deleteMany()
    }
}