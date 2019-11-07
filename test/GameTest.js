var Battleship = artifacts.require("Battleship");
let accounts, battleship;
contract('Game Test', () => {
    beforeEach(async () => {
        // get the accounts
        accounts = await web3.eth.getAccounts();
        battleship = await Battleship.deployed();
    });
    it('Complete Game', async () => {
        positions = [[1,9,21,31,98,99, 68,69,58,59,2,3,4,10,20,30,40,41,42,43], [1,9,21,31,98,99, 68,69,58,59,2,3,4,10,20,30,40,41,42,43]];
        nonce = [1234, 5678];
        await battleship.commit("0x6fd05809f78fe572eb4fe5c73371d806c3eb14a125a3022df8840a78ccc11d8b", { from: accounts[1]});
        await battleship.commit("0xe716e228766c7d437aab1aa47d72d72908e72977952140556d031673a83389a4", { from: accounts[2]});
        for(var i = 0; i < 20; ++i) {
            for (var j = 0; j < 2; ++j) {
                if(j == 1 && i == 19) {
                    break;
                }
                await battleship.make_move(positions[1-j][i], { from: accounts[1+j]});
                let hit = 0;
                if(i < 4) {
                    hit = 1;
                } else if (i < 10) {
                    hit = 2;
                } else if (i < 16) {
                    hit = 3;
                } else {
                    hit = 4;
                }
                await battleship.reply_move(hit, { from: accounts[2-j]});
            }
        }
        for (var i = 0; i < 2; ++i) {
            battleship.reveal(positions[i], nonce[i]);
        }
        assert(true);
    });
});