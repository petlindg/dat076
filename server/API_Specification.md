## userDataRouter (base route: /userData)
```
GET /userData
return UserData body with user data of the currentlly logged in user
200 on success, 404 if user not found, 500 on other errors
```
```
POST /userData/incrementParsnip
increments parsnip balance by their parsnipPerClick for the logged in user, returns the new count in string
200 on success, 404 if user not found, 500 on other errors
```
```
POST /userData/purchaseActivePowerUp 
Request Body : { powerupActiveId: string } - ObjectId of the powerup to purchase as a string
Increments the parsnipsPerClick of logged in user by parsnipPerClick of purchased object and notes the purchase. Price is calculated automatically
200 on success, 403 if user can not afford the purchase, 404 if user or powerup not found, 500 on other errors
```
```
GET /userData/statistics
Returns the statistics of the curretly logged in user
200 on success, 404 if user not found, 500 on other errors
```
```
GET /userData/leaderboard
Query: sortBy: string REQUIRED, limit: number default=20
Returns a leaderboard of users sorted from best to worst by sorted by sortBy, returns the best "limit" users
200 on successs, 400 on bad request (invalid querry), 500 on other errors
```
```
POST /userData/purchasePassivePowerUp 
Request Body : { powerupPassiveId: string } - ObjectId of the powerup to purchase as a string
Increments the parsnipsPerSecond of logged in user by parsnipsPerSecond of purchased object and notes the purchase. Price is calculated automatically
200 on success, 403 if user can not afford the purchase, 404 if user or powerup not found, 500 on other errors
```

## userCredentialsRouter (base route: /userCredentials)
```
GET /userCredentials
Returns and UserCredentials of the currently logged in user
200 on success 404 if user not found, 500 on other errors
```
```
PATCH /userCredentials
Request Body { newUsername: string } - new username to be applied
Updates the username of the currentlly logged in user
200 if successful, 400 if null or empty username, 404 if user not found, 500 on other errors
```

## powerupActiveRouter (base route: /powerupActive)
```
GET /powerupActive
Returns a list of all available powerups. Objects include a field, where the current price is precomputed for the user, based on the amount of times they've purchased it already
200 on success, 404 on user not found, 500 on other errors
```

## authRouter (base route: /auth)
```
POST /auth/register
Request Body { email: string, password: string, username: string } - credentials of a new user
Creates a new user and automatically logs them in
201 on success 400 on bad request, 403 if already logged in, 409 if account with the email already exists, 500 on other errors
Password is encrypted automatically
```
```
POST /auth/login
Request Body { email: string, password: string } - credentials of the user
Logs in an existing user
200 on success, 400 on bad request, 403 on invalid credentials, 500 on other errors
```
```
DELETE /auth/logout
Logs the user out by destorying their session
200 on success, 500 on error
```
```
GET /auth
Returns true is user is logged in, false else
200 on success, 500 on some unexpected error
```
