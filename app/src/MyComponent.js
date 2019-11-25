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
          var testFoo = "0x341f85f5eca6304166fcfb6f591d49f6019f23fa39be0615e6417da06bf747ce";
          this.Battleship.methods.commit('0x674326e0b84c4e1f943cd8cdf1988f78f4ec855458356b52f2d796d421d64866').send({
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