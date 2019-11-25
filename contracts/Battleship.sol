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
    string public stored_string;
    address[2] player_address;
    uint8[100][2] public board_original;
    uint8 first = 2;
    constructor() public {
        owner = msg.sender;
        for(uint i = 0; i<2; ++i){
            for(uint j = 0; j<100; ++j){
                move_log[i][j] = 100;
                reply_log[i][j] = 5;
            }
        }

    }

    /// @notice Event for returning the winner
    event Winner(
        address indexed addr,
        uint8 player_index,
        uint8 temp
    );
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
        require(player_address[0] != msg.sender, "You cannot commit twice");
        require(player_address[1] == address(0), "Two Players commited already");
        player_address[1] = msg.sender;
        commitment[1] = _commit;
        return;
    }

    function make_move(uint8 _position) public returns (string memory) {
        require(player_address[1] != address(0), "Plese wait!.Other Player still not commited");
        require(player_address[0] == msg.sender || player_address[1] == msg.sender, "You are not registered");
        require(score[0] < 20 && score[1] < 20, "Game Over");
        uint8 player = (player_address[0] == msg.sender) ? 0 : 1;
        if(move_idx[0] == 0 && move_idx[1] == 0) {
            first = player;
        }
        require((player == first && move_idx[player] == move_idx[1-player]) || (player != first && move_idx[player] + 1 == move_idx[1-player]), "Out of turn");
        require(board_intermediate[player][_position] == false, "Already hit");
        board_intermediate[player][_position] = true;
        require(move_log[player][move_idx[player]] == 100, "Move already made");
        move_log[player][move_idx[player]] = _position;
        // TODO: Emit event that move has been made
        return "made move";
    }


    function reply_move(uint8 _reply) public returns (string memory) {
        /// @dev The player for whom reply is given
        uint8 player = (player_address[0] == msg.sender) ? 1 : 0; // TODO: Fix bug allowing multiple participating addresses
        require(move_log[player][move_idx[player]] != 100, "Move not made");
        require(reply_log[player][move_idx[player]] == 5, "Reply already made");
        reply_log[player][move_idx[player]] = _reply;
        move_idx[player] = move_idx[player] + 1;
        score[player] = score[player] + 1;
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


    function place_ship(uint8[20] memory _positions, uint8 _index, uint8 _size, uint8 player) internal returns (bool){
        uint8 diff = _positions[_index+1] - _positions[_index];
        uint8 end = _index + _size;
        if(board_original[player][_positions[_index]] != 0) {
            return false;
        }
        board_original[player][_positions[_index]] = _size;
        for(uint8 i = _index+1; i < end; i++) {
            if(_positions[i] - _positions[i-1] != diff || board_original[player][_positions[i]] != 0) {
                return false;
            }
            board_original[player][_positions[i]] = _size;
        }
        return true;
    }


    function declare_winner(uint8 _winner, uint8 temp) internal {
        emit Winner(player_address[_winner], _winner, temp);
        return;
    }


    /// @notice Reveal the positions
    /// @param _positions Ordered list of the positions of player's ships
    /// @param _nonce Same nonce used for commitment earlier
    function reveal(uint8[20] memory _positions, uint256 _nonce) public returns (uint8){
        require(score[0] == 20 || score[1] == 20, "Game not yet over");
        uint8 player = (player_address[0] == msg.sender) ? 0 : 1;
        bytes32 test_hash = keccak256(abi.encodePacked(_positions, _nonce));
        for(uint8 i = 0; i < 100; i++) {
            board_original[player][i] = 0;
        }
        if(test_hash != commitment[player]) {
            declare_winner(1-player, 81);
        }
        for(uint8 i = 0; i < 4; ++i) {
            if(!place_ship(_positions, i, 1, player)) {
                declare_winner(1-player, i);
            }
        }
        for(uint8 i = 4; i < 10; i = i+2) {
            if(!place_ship(_positions, i, 2,player)) {
                declare_winner(1-player, i);
            }
        }
        for(uint8 i = 10; i < 16; i = i+3) {
            if(!place_ship(_positions, i, 3,player)) {
                declare_winner(1-player, i);
            }
        }
        for(uint8 i = 16; i < 20; i = i+4) {
            if(!place_ship(_positions, i, 4, player)) {
                declare_winner(1-player, i);
            }
        }
        for(uint8 i = 0; i < move_idx[1-player]; ++i) {
            if(board_original[player][move_log[1-player][i]] != reply_log[1-player][i]) {
                declare_winner(1-player, board_original[player][move_log[1-player][i]]+100);
            }
        }
        commitment[player] = 0x0;
        if(commitment[0] == 0x0 && commitment[1] == 0x0) {
            if(score[0] == 20) {
                declare_winner(0, 64);
            } else {
                declare_winner(1,64);
            }
        }
    }
    function generate_commitment(uint8[20] memory _positions, uint256 _nonce) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_positions, _nonce));
    }
}