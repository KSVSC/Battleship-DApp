var Battleship = artifacts.require("Battleship");
const truffleAssert = require('truffle-assertions');
let accounts, battleship;
contract('EdgeCasesTest', () => {
    beforeEach(async () => {
        // get the accounts
        accounts = await web3.eth.getAccounts();
        battleship = await Battleship.deployed();
    });
    it('Deposit', async () => {
        try {
            await battleship.deposit("3", { from: accounts[0], value: web3.utils.toWei("5", "wei") });
        }
        catch (err) {
            assert(err, "Incorrect Amount, specified amount does not match transaction value");
        }
    });
    it('Second attempt to commit', async () => {
        positions = [[1, 9, 21, 31, 98, 99, 68, 69, 58, 59, 2, 3, 4, 10, 20, 30, 40, 41, 42, 43], [1, 9, 21, 31, 98, 99, 68, 69, 58, 59, 2, 3, 4, 10, 20, 30, 40, 41, 42, 43]];
        pos = [1, 9, 23, 31, 98, 99, 68, 69, 58, 59, 2, 3, 4, 10, 20, 30, 40, 41, 42, 43];
        nonce = [1234, 5678];
    
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        await battleship.commit("0x6fd05809f78fe572eb4fe5c73371d806c3eb14a125a3022df8840a78ccc11d8b", { from: accounts[1] });
    
        try {
            await battleship.commit("0xe716e228766c7d437aab1aa47d72d72908e72977952140556d031673a83389a4", { from: accounts[1] });
        }
        catch (err) {
            assert(err, "You cannot commit twice");
        }
    });
    it('Cannot make move before second player commit', async () => {
        try {
            await battleship.make_move("1", { from: accounts[1] });
        }
        catch (err) {
            assert(err, "Plese wait!.Other Player still not commited");
        }
    });
    it('Only two players are allowed', async () => {
        await battleship.commit("0xe716e228766c7d437aab1aa47d72d72908e72977952140556d031673a83389a4", { from: accounts[2] });
    
        try {
            await battleship.commit("0xb826e228766c7d437aab1aa47d72d72908e72977952140556d031673a83389a4", { from: accounts[3] });
        }
        catch (err) {
            assert(err, "Two Players commited already");
        }
    });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    it('Register to make_move', async () => {
        await battleship.make_move("43", { from: accounts[1] });
        await battleship.reply_move("4", { from: accounts[2] });

        try {
            await battleship.make_move("1", { from: accounts[3] });
        }
        catch (err) {
            assert(err, "You are not registered")
        }
    });
    it('Turn alter', async () => {
        try {
            await battleship.make_move("78", { from: accounts[1] });
        }
        catch (err) {
            assert(err, "Out of turn")
        }
    });
    it('Cannot make two moves in a Turn', async () => {
        await battleship.make_move("43", { from: accounts[2] });

        try {
            await battleship.make_move("78", { from: accounts[2] });
        }
        catch (err) {
            assert(err, "Move already made")
        }
    });
    it('Cannot make two replies in a Turn', async () => {
        try {
            await battleship.reply_move("4", { from: accounts[2] });
        }
        catch (err) {
            assert(err, "Reply already made")
        }
    });
    it('Reveal only after game end', async () => {
        await battleship.reply_move("4", { from: accounts[1] });

        try {
            await battleship.reveal(positions[i], nonce[i]);
        }
        catch (err) {
            assert(err, "Game not yet over");
        }
    });
    it('Cannot make moves after max score reached', async () => {
        for (var i = 0; i < 19; ++i) {
            for (var j = 0; j < 2; ++j) {
                if (j == 1 && i == 18) {
                    break;
                }
                await battleship.make_move(positions[1 - j][i], { from: accounts[1 + j] });
                let hit = 0;
                if (i < 4) {
                    hit = 1;
                } else if (i < 10) {
                    hit = 2;
                } else if (i < 16) {
                    hit = 3;
                } else {
                    hit = 4;
                }
                await battleship.reply_move(hit, { from: accounts[2 - j] });
            }
        }

        try {
            await battleship.make_move("55", { from: accounts[1] });                
        }
        catch (err) {
            assert(err, "Game Over");
        }
    });
    it("when reveal wrong opponent win", async () => {
        let a = await battleship.reveal(pos, nonce[0], { from: accounts[1] });
        await battleship.reveal(positions[1], nonce[1], { from: accounts[2] });
        truffleAssert.eventEmitted(a, 'Winner', (x) => {
            return x.addr == accounts[2];
        });
    });
    it("Player1 wins", async () => {
        await battleship.reveal(positions[1], nonce[0], { from: accounts[1] });
        let winner = await battleship.reveal(pos, nonce[1], { from: accounts[2] });
        truffleAssert.eventEmitted(winner, 'Winner', (x) => {
            return x.addr == accounts[1];
        });
    });
    it("Player1 with max score wins when both are honest", async () => {
        await battleship.reveal(positions[0], nonce[0], { from: accounts[1] });
        let a = await battleship.reveal(positions[1], nonce[1], { from: accounts[2] });
        truffleAssert.eventEmitted(a, 'Winner', (x) => {
            return x.addr == accounts[1];
        });
    });
});