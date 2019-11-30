import Battleship from "./contracts/Battleship.json";
var Web3 = require('web3');

const options = {
  web3: {
    block: false,
    customProvider: new Web3(Web3.givenProvider || "ws://localhost:8545"),
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545",
    },
  },
  contracts: [Battleship],
  events: {
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
