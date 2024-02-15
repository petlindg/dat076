import { UserService } from "./user";
import { User } from "../model/user"

test("If we create a new user they have 0 parsnips, and if it increments its 1", async () => {
    const user : UserService = new UserService();
    expect(await user.getParsnips()).toEqual(0)
    await user.incParsnip();
    expect(await user.getParsnips()).toEqual(1);
})

test("If we buy a powerUp, user.parsnipsPerClick increases if we can afford it, else it returns false", async () => {
    const user : UserService = new UserService();
    let userData : User = await user.getUser()
    
    expect(await user.buyPowerUp()).toBeFalsy()
    expect(await userData.parsnipsPerClick).toEqual(1);

    for(let i = 0; i < 25; i++)
        await user.incParsnip() 
    
    expect(await user.buyPowerUp()).toBeTruthy();
    userData = await user.getUser()
    expect(userData.parsnipsPerClick).toEqual(2)
})

test("If we create a new user and update his userName, the userName should be updated", async () => {
    const userService : UserService = new UserService();
    await userService.updateUserName("TestName");
    const userData : User = await userService.getUser();

    expect(userData.userName).toEqual("TestName");
})
