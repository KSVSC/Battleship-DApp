var Battleship = artifacts.require("Battleship");

contract('Initial Test', function (accounts) {
    const ERROR = 'VM Exception while processing transaction: revert'

    // function sleep(miliseconds) {
    //     var currentTime = new Date().getTime();
    //     while (currentTime + miliseconds >= new Date().getTime()) {
    //     }
    // }

    ////////////////////Admin Deploys the Game//////////////////////////
    it("Amount should match transaction value", () => {
        return Battleship.deployed()
            .then(async function (instance) {
                try {
                    await instance.deposit("3",{ from: accounts[0], value: web3.utils.toWei("5", "wei") });
                }
                catch (err) {
                    assert(err, "Incorrect Amount, specified amount does not match transaction value");
                }
            });
    })

    it("Player shouldn't be allowed to register twice ", () => {
        return Battleship.deployed()
            .then(async function (instance){
                try {
                    await instance.commit("0x6fd05809f78fe572eb4fe5c73371d806c3eb14a125a3022df8840a78ccc11d8b", { from: accounts[1] });   
                    await instance.commit("0xe716e228766c7d437aab1aa47d72d72908e72977952140556d031673a83389a4", { from: accounts[1] });   
                    
                }
                catch (err) {
                    assert(err, "player cannot commit twice");                  
                }
            });
    })

    it("Player1 should be able to make_move before player 2 commits", () => {
        return Battleship.deployed()
            .then(async function (instance) {
                try {
                    await instance.make_move("1", { from: accounts[1] });

                }
                catch (err) {
                    assert(err, "Both Players still not commited");
                }
            });
    });

    it("Not more than 2 Players should be able to commit", () => {
        return Battleship.deployed()
            .then(async function (instance) {
                try {
                    await instance.commit("0xe716e228766c7d437aab1aa47d72d72908e72977952140556d031673a83389a4",{ from: accounts[2]});
                    await instance.commit("0xe716e228766c7d437aab1aa47d72d72908122977952140556d031673a83389a4", { from: accounts[3] });
                }
                catch (err) {
                    assert(err, "Two Players commited already");
                }
            });
    });

});
//     ////////////////////Register into the Game//////////////////////////
//     it("Player2 should be able to register", () => {
//         return SPSLS.deployed()
//             .then(async function (instance) {
//                 await instance.register_as_player({ from: accounts[1], value: web3.utils.toWei("5", "ether") });
//                 await instance.register_as_player({ from: accounts[2], value: web3.utils.toWei("5", "ether") });
//                 return instance.current_number_of_players.call();
//             }).then(function (current_number_of_players) {
//                 assert.equal(current_number_of_players.valueOf(), 2, "Player2 registered");
//             });
//     });
 
