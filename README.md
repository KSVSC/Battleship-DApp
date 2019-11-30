# Battleship-DApp

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