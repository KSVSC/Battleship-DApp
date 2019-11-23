import React from "react";
import logo from "./logo.png";
import Button from '@material-ui/core/Button';
import Game from './Game';

class MyClass extends React.Component{
  constructor(props) {
    super(props);
    console.log(props);
    this.Battleship = props.drizzle.contracts.Battleship;
  }
  render() {
    return (<div className="App">
      <div>
        <img src={logo} alt="drizzle-logo" />
        <h1>Drizzle Examples</h1>
        <p>Examples of how to get started with Drizzle in various situations.</p>
      </div>
      <div id="draw-shapes" />
      <Game drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
      <div className="section">
        <h2>Testing</h2>
        <Button color="primary" onClick={() => {
          this.Battleship.methods.commit('0x6fd05809f78fe572eb4fe5c73371d806c3eb14a125a3022df8840a78ccc11d8b').send({
            from: this.props.drizzleState.accounts[0]
          }, (e) => {
            console.log(e);
          })
        }}>
          Click Me!
        </Button>
      </div>
    </div>);
  }
};

export default MyClass;