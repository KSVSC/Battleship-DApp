var Battleship = artifacts.require("Battleship");

module.exports = function(deployer) {
  deployer.deploy(Battleship);
};
