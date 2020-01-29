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

## Game Implementation
- This is a multiplayer game.
- The game has two boards and four types of ships: Battleship, Destroyer, Cruiser, Submarine.
- Every players initial board should expicitly have 1 Battleship, 2 Destroyers, 3 Cruisers and 4 Submarines.
- The First player commits his board initiallly, by placing his\her ships in the first board and waits for the Second player to commit.
- After two players have commited their boards, players start targeting the opponents ships by making hits.
- The hits are made alternatively by two players in the second board.
- The other player responds to the hits by replying the type of the ship if its a hit and 0 otherwise.
- The cell in the second board is colored accordingly.
- After the sufficient hits are made for a player to win the game, players can't make anymore hits.
- Both the players reveal their positions and then the winner is declared.
