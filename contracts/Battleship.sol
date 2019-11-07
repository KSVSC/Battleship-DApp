pragma solidity >=0.5.2 <0.6.0;

contract Battleship {
    address payable public owner;
    /// @dev Stores the intermediate moves in phase 2
    bool[2][100] board_intermediate;
    /// @dev Logs of player's moves
    uint8[2][100] move_log;
    uint8[2] move_idx;
    uint8[2][100] reply_log;
    /// @dev Scores of the players
    uint8[2] score;
    /// @dev Stores the commitment for the 2 players in phase 1
    bytes32[2] commitment;
    address[2] player_address;

    constructor() public {
        owner = msg.sender;
    }

    /// @notice Deposit ether into the contract
    /// @param _amount Value of ether being deposited (in wei)
    function deposit(uint _amount) public payable {
        require(msg.value == _amount, "Incorrect Amount, specified amount does not match transaction value");
        // This condition rejects any typos in transaction
    }

    /// @notice Commit the positions of the ships
    /// @param _commit SHA-3 256 Hash of the Choice and random nonce
    function commit(bytes32 _commit) public {
        if(player_address[0] == address(0)) {
            player_address[0] = msg.sender;
            commitment[0] = _commit;
            return;
        }
        require(player_address[0] != msg.sender, "player cannot register twice");
        player_address[1] = msg.sender;
        commitment[1] = _commit;
        return;
    }

    function make_move(uint8 _position) public {
        require(player_address[1] != address(0), "Both Players still not commited");
        require(score[0] < 20 && score[1] < 20, "Game Over");
        player = (player_address[0] == msg.sender) ? 0 : 1;
        require(move_idx[player] == move_idx[1-player] - 1, "Out of turn");
        require(board_intermediate[player][_position] == false, "Already hit");
        board_intermediate[player][_position] = true;
        require(move_log[player][move_idx[player]] == 0, "Position given");
        move_log[player][move_idx[player]] = _position;
        // TODO: Emit event that move has been made
    }

    function reply_move(uint8 _reply) public {
        /// @dev The player for whom reply is given
        player = (player_address[0] == msg.sender) ? 1 : 0;
        require(move_log[player][move_idx[player]] != 0, "No move given");
        reply_log[move_idx[player]] = _reply;
        move_idx[player] = move_idx[player] + 1;
        score[player] = score[player] + _reply;
        if(score[player] == 20) {
            end_game();
        }
        // TODO: Emit event that reply has been made
    }

    function end_game() public {
        // TODO: Emit event that GAME OVER
    }

    /// @notice Reveal the positions
    /// @param _positions Ordered list of the positions of player's ships
    /// @param _nonce Same nonce used for commitment earlier
    function reveal(uint8[20] _positions, uint256 _nonce) public {
        require(score[0] == 20 || score[1] == 20, "Game Over");
        player = (player_address[0] == msg.sender) ? 0 : 1;
        bytes32 test_hash = keccak256(abi.encodePacked(_positions, _nonce));
        if(test_hash != commitment[player]) {
            // TODO: Emit event with the winner
            return 1-player;
        }
        uint8[100] board_original;
        for(uint8 i = 0; i < 4; ++i) {
            board_original[_positions[i]] = 1;
        }
        for(uint8 i = 4; i < 10; i += 2) {
            if(_positions[i+1] == _positions[i] + 1 || _positions[i+1] == _positions[i] + 10) {
                board_original[_positions[i]] = 2;
                board_original[_positions[i+1]] = 2;
            }
        }
        for(uint8 i = 10; i < 16; i+=3) {
            diff = _positions[i+1] - _positions[i];
            if(diff == 1 || diff == 10) {
                board_original[_positions[i]] = 3;
                for(uint8 j = 1; j < 3; ++j) {
                    if(_positions[i] - _positions[i-1] == diff) {
                        board_original[_positions[i]] = 3;
                    }
                }
            }
        }
        for(uint8 i = 16; i < 20; i+=4) {
            diff = _positions[i+1] - _positions[i];
            if(diff == 1 || diff == 10) {
                board_original[_positions[i]] = 4;
                for(uint8 j = 1; j < 4; ++j) {
                    if(_positions[i] - _positions[i-1] == diff) {
                        board_original[_positions[i]] = 4;
                    }
                }
            }
        }
        // TODO: Check if replies match
        // TODO: Declare winner
    }
}