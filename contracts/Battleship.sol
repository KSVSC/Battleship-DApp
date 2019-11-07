pragma solidity >=0.5.2 <0.6.0;

contract Battleship {
    address payable public owner;
    /// @dev Stores the intermediate moves in phase 2
    bool[100][2] board_intermediate;
    /// @dev Logs of player's moves
    uint8[100][2] move_log;
    uint8[2] move_idx;
    uint8[100][2] reply_log;
    /// @dev Scores of the players
    uint8[2] score;
    /// @dev Stores the commitment for the 2 players in phase 1
    bytes32[2] commitment;
    address[2] player_address;
    uint8 first = 2;
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
        player_address[1] = msg.sender;
        commitment[1] = _commit;
        return;
    }

    function make_move(uint8 _position) public returns (string memory) {
        require(player_address[1] != address(0), "Both Players still not commited");
        require(score[0] < 20 && score[1] < 20, "Game Over");
        uint8 player = (player_address[0] == msg.sender) ? 0 : 1;
        if(move_idx[0] == 0 && move_idx[1] == 0) {
            first = player;
        }
        require((player == first && move_idx[player] == move_idx[1-player]) || (player != first && move_idx[player] + 1 == move_idx[1-player]), "Out of turn");
        require(board_intermediate[player][_position] == false, "Already hit");
        board_intermediate[player][_position] = true;
        require(move_log[player][move_idx[player]] == 0, "Out of turn1");
        move_log[player][move_idx[player]] = _position;
        // TODO: Emit event that move has been made
        return "made move";
    }

    function reply_move(uint8 _reply) public returns (string memory) {
        /// @dev The player for whom reply is given
        uint8 player = (player_address[0] == msg.sender) ? 1 : 0; // TODO: Fix bug allowing multiple participating addresses
        require(move_log[player][move_idx[player]] != 0, "Out of turn");
        reply_log[player][move_idx[player]] = _reply;
        move_idx[player] = move_idx[player] + 1;
        score[player] = score[player] + _reply;
        if(score[player] == 20) {
            end_game();
        }
        // TODO: Emit event that reply has been made
        return "made reply";
    }

    function end_game() public returns (string memory) {
        // TODO: Emit event that GAME OVER
        return "game over";
    }

    function place_ship(uint8[20] memory _positions, uint8[100] memory _board, uint8 _index, uint8 _size) internal returns (bool){
        uint8 diff = _positions[_index+1] - _positions[_index];
        uint8 end = _index + _size;
        if(_board[_index] != 0) {
            return false;
        }
        _board[_index] = _size;
        for(uint8 i = _index+1; i < end; ++i) {
            if(_board[i] - _board[i-1] != diff || _board[i] != 0) {
                return false;
            }
            _board[i] = _size;
        }
        return true;
    }

    function declare_winner(uint8 _winner) internal returns (uint8) {
        // TODO: Emit Event to declare winner
        return _winner;
    }
    /// @notice Reveal the positions
    /// @param _positions Ordered list of the positions of player's ships
    /// @param _nonce Same nonce used for commitment earlier
    function reveal(uint8[20] memory _positions, uint256 _nonce) public {
        require(score[0] == 20 || score[1] == 20, "Game Over");
        uint8 player = (player_address[0] == msg.sender) ? 0 : 1;
        bytes32 test_hash = keccak256(abi.encodePacked(_positions, _nonce));
        if(test_hash != commitment[player]) {
            declare_winner(1-player);
        }
        uint8[100] memory board_original;
        for(uint8 i = 0; i < 4; ++i) {
            if(!place_ship(_positions, board_original, i, 1)) {
                declare_winner(1-player);
            }
        }
        for(uint8 i = 4; i < 10; i = i+2) {
            if(!place_ship(_positions, board_original, i, 2)) {
                declare_winner(1-player);
            }
        }
        for(uint8 i = 10; i < 16; i = i+3) {
            if(!place_ship(_positions, board_original, i, 3)) {
                declare_winner(1-player);
            }
        }
        for(uint8 i = 16; i < 20; i = i+4) {
            if(!place_ship(_positions, board_original, i, 4)) {
                declare_winner(1-player);
            }
        }
        for(uint8 i = 0; i < move_idx[1-player]; ++i) {
            if(board_original[move_log[1-player][i]] != reply_log[1-player][i]) {
                declare_winner(1-player);
            }
        }
        commitment[player] = 0x0;
        if(commitment[0] == 0x0 && commitment[1] == 0x0) {
            if(score[0] == 20) {
                declare_winner(0);
            } else {
                declare_winner(1);
            }
        }
    }
    // TODO: Remove this function
    function generate_commitment(uint8[20] memory _positions, uint256 _nonce) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_positions, _nonce));
    }
}