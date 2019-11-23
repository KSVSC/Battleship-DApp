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
            board_orientation: {},
            ship: {
                type: 0,
                orientation: 'h'
            }
        };
        var params = { width: 410, height: 410 };
        this.two = new Two(params)
    }

    commit() {
        const { Battleship } = this.props.drizzle;
        const { accounts } = this.props.drizzleStatus;
        var commitHash = '0x6fd05809f78fe572eb4fe5c73371d806c3eb14a125a3022df8840a78ccc11d8b';
        Battleship.methods.commit(commitHash).send({
            from: accounts[0]
        }, (e, h) => {
            if(e) {
                console.log('Error Occured:', e);
            } else {
                console.log('Tx Successful:', h);
            }
        });
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
        // console.log(this.state.positions);
        this.two.update();
    }

    placeShip = start => {
        const type = this.state.ship.type;
        var positions = this.state.positions;
        var diff = (this.state.ship.orientation == 'h') ? 10 : 1;

        // Toggle ships
        if (start in this.state.board_orientation && this.state.board_orientation[start] != '-') {
            var change = (this.state.board_orientation[start] == 'h') ? 1 : 10;
            var old = (this.state.board_orientation[start] == 'h') ? 10 : 1;
            //TODO: check for bounding ship inside grid  
            for (var i = start + change; i < start + type * change && i < 100; i = i + change) {
                if (i in this.state.board_orientation) {
                    return positions;
                }
            }
            for (var i = start; i < start + type * old && i < 100; i = i + old) {
                this.state.grid[i].fill = COLOR_SKY;
                for (var j = 0; j < positions.length; j++) {
                    if (positions[j]['i'] == i)
                        positions.splice(j, 1);
                }
                if(i != start) delete this.state.board_orientation[i];
            }
            this.state.board_orientation[start] = (this.state.board_orientation[start] == 'h') ? 'v' : 'h';
            diff = (this.state.board_orientation[start] == 'h') ? 10 : 1;
        }
        else if (this.state.board_orientation[start] == '-') {
            return positions;                 
        }
        else {
            this.state.board_orientation[start] = 'h';
        }

        
        // Check for overlapping
        for (var i = start + diff; i < start + type * diff && i < 100; i = i + diff) {
            //TODO: check for bounding ship inside grid  
            // console.log(this.state.grid.findIndex(z => z.id == i))
            if (i in this.state.board_orientation) {
                delete this.state.board_orientation[start]
                return positions;
            }
        }
        
        for (var i = start; i < start + type * diff && i < 100; i = i + diff) {
            if (i == start) this.state.board_orientation[i] = this.state.board_orientation[start];
            else this.state.board_orientation[i] = '-';
            positions.push({ type, i });                
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
                const diff = (this.state.ship.orientation == 'h') ? 10 : 1;
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