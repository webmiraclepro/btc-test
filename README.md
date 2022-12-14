# BTC Test
#### Description
##### A web app that allows users to make guesses on whether the market price of Bitcoin (BTC/USD) will be higher or lower after one minute.  
#### Rules
- The player can at all times see their current score and the latest available BTC price in USD
- The player can choose to enter a guess of either “up” or “down“
- After a guess is entered the player cannot make new guesses until the existing guess is resolved
- The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
- If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If
the guess is incorrect, the user loses 1 point.
- Players can only make one guess at a time
- New players start with a score of 0

## Backend
##### Express.js backend that allows users to get and update score by metamask wallet address to database hosted on MongoDB Cloud Service.
#### `npm install` to install dependencies
#### `npm dev` to run server development mode
#### `npm start` to run server production mode  
| Route | Description |
| ----------- | ----------- |
| **/api/get-score** | Get score by address |
| **/api/plus-score** | Plus score by address |
| **/api/minus-score** | Minus score by address |
## Frontend
##### React.js + MUI frontend that allows users to play by conecting metamask wallet or public address.
#### `npm install` to install dependencies
#### `npm start` to deploy the all on local
#### How to play
1. Connect wallet
2. Click on `Up` or `Down` button within a minute
