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
        <img src={logo} alt="drizzle-logo" height={400}/> 
      </div>
      <div id="draw-shapes" />
      <Game drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
    </div>);
  }
};

export default MyClass;