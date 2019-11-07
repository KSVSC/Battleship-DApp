import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";
import Player from './player'
import logo from "./logo.png";
import TwoRotation from "./player";

export default ({ accounts }) => (
  <div className="App">
    <div>
      <img src={logo} alt="drizzle-logo" />
      <h1>Drizzle Examples</h1>
      <p>Examples of how to get started with Drizzle in various situations.</p>
    </div>
    <TwoRotation />
    <div className="section">
      <h2>Active Account</h2>
      <AccountData accountIndex={0} units="ether" precision={3} />
    </div>

    <div className="section">
      <h2>SimpleStorage</h2>
      <p>
        This shows a simple ContractData component with no arguments, along with
        a form to set its value.
      </p>
      <ContractForm contract="Battleship" method="commit" />
      <ContractForm contract="Battleship" method="make_move" />
      <ContractForm contract="Battleship" method="reply_move" />
      <ContractForm contract="Battleship" method="reveal" />
    </div>
  </div>
);
