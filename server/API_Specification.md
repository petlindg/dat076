## userDataRouter (base route: /userData)
```
GET /userData
returns 200 and UserData body with user data of the currentlly logged in user, 404 if user not found
```
```
POST /userData/incrementParsnip
increments parsnip balance by their parsnipPerClick for the logged in user, returns the new count in string. 404 if user not found
```
```
POST /userData/purchaseActivePowerUp 
Request Body : { powerupActiveId: string } - ObjectId of the powerup to purchase as a string
Increments the parsnipPerClick of logged in user by parsnipPerClick of purchased object and notes the purchase. Price is calculated automatically. 200 if success, 403 if user can not afford the purchase
```

## userCredentialsRouter (base route: /userCredentials)
```
GET /userCredentials
Returns 200 and UserCredentials of the currently logged in user, 404 if user not found
```
```
PATCH /userCredentials
Request Body { newUsername: string } - new username to be applied
Updates the username of the currentlly logged in user 200 if successful, 400 if null or empty username
```

## powerupActiveRouter (base route: /powerupActive)
```
GET /powerupActive
Returns a list of all available powerups. Objects include a field, where the current price is precomputed for the user, based on the amount of times they've purchased it already
```
