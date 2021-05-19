# Battleship-DApp
This is an implementation of battleship on blockchain similar to the one you must've played in your childhood.
![Screenshot](https://i.imgur.com/0awm5bm.png)

# Usage
1. Clone the repository `git clone https://github.com/KSVSC/Battleship-DApp.git`
2. `cd Battleship-DApp && npm i`
3. `truffle build`
4. `cd app && npm i`
5. Run the backend server `go run Backend.go` from the `backend/` directory
6. Run the blockchain test net `truffle develop` and use `deploy` in the interactive CLI to deploy the contracts
7. Run the front-end server `npm start` from the `app/` directory

Enjoy the game!

# Details
The UI of the game was built with `Two.js` (https://two.js.org/) backend (deployed on blockchain) was written in Solidity and a minimal Golang server is used as a backend for handling the contract addresses.
