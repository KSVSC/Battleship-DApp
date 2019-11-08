import Battleship from "./contracts/Battleship.json";

const options = {
  web3: {
    block: false,
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
