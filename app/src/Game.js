import React from 'react';
import Two from 'two.js';
import Button from '@material-ui/core/Button';
import {COLOR_SKY, COLOR_SEA, COLOR_BROWN} from './Colors';
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.gameRef = React.createRef();
        this.state = {
            cursor: {
                x: 0,
                y: 0    
            },
            grid: undefined,
            stage: 'place',
            positions: [],
            ship: {
                type: 0,
                orientation: 'h'
            }
        };
        var params = { width: 410, height: 410 };
        this.two = new Two(params)
    }

    componentDidMount() {
        // Make an instance of two and place it on the page.
        var elem = this.gameRef.current;
        this.two.appendTo(elem);
        // GAME Code goes here !!
        var rect = this.two.makeRoundedRectangle(205, 205, 410, 410, 5);

        rect.fill = COLOR_SEA;
        rect.opacity = 0.75;
        rect.noStroke();
        var grid = new Array(100);
        for(var i = 0; i < 10; ++i) {
            for(var j = 0; j < 10; ++j) {
                var rect = this.two.makeRoundedRectangle(22.75+40.5*i, 22.75 + 40.5*j, 35.5, 35.5, 5);

                rect.fill = COLOR_SKY;
                rect.opacity = 0.75;
                rect.noStroke();
                grid[10*i+j] = rect;
            }
        }
        // Don't forget to tell two to render everything
        // to the screen
        this.two.update();
        this.setState({grid});
    }

    componentWillUpdate() {
        console.log(this.state.positions);
        this.two.update();
    }

    placeShip = start => {
        const type = this.state.ship.type;
        var positions = this.state.positions;
        const diff = (this.state.ship.orientation == 'v') ? 1 : 10;
        for(var i = start; i < start + type*diff && i < 100; i=i+diff) {
            positions.push({type, i});
        }
        return positions;
    }

    handleMouseDown = e => {
        var x = e.clientX;
        var y = e.clientY;
        var positions = this.state.positions;
        if(this.state.stage == 'place') {
            var start = this.state.grid.findIndex(z => z.id == e.target.id);
            if(start != -1) {
                positions = this.placeShip(start);
            }
        }
        this.setState({
          cursor: { x, y },
          positions
        });
    }

    handleMouseMove = e => {
        var x = e.clientX;
        var y = e.clientY;
        if(this.state.stage == 'place') {
            var grid = this.state.grid; 
            var start = grid.findIndex(z => z.id == e.target.id);
            if(start != -1) {
                const type = this.state.ship.type;
                const diff = (this.state.ship.orientation == 'v') ? 1 : 10;
                grid.forEach((z, idx) => z.fill = (!this.state.positions.find(a => a.i == idx)) ? COLOR_SKY : COLOR_BROWN);
                for(var i = start; i < start + type*diff && i < 100; i=i+diff) {
                    grid[i].fill = COLOR_BROWN;
                }
            }
        }
        this.setState({cursor: { x, y }});
    }

    setShip = type => this.setState({
        ship: {
            type,
            orientation: 'h'
        }
    });
    render() {
        return (<>
            <Button variant="outlined" onClick={() => this.setShip(4)}>
                Battleship
            </Button>
            <Button variant="outlined" onClick={() => this.setShip(3)}>
                Destroyer
            </Button>
            <Button variant="outlined" onClick={() => this.setShip(2)}>
                Cruiser
            </Button>
            <Button variant="outlined" onClick={() => this.setShip(1)}>
                Submarine
            </Button>
        <div ref={this.gameRef} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} />
        </>);
    }
}

export default Game;