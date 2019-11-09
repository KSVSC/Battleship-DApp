import React from 'react';
import Two from 'two.js';
import {COLOR_SKY, COLOR_SEA} from './Colors';
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.gameRef = React.createRef();
        this.state = {
            cursor: {
                x: 0,
                y: 0    
            },
            grid: undefined
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
        console.log(this.state);
        this.two.update();
    }

    handleMouseDown = e => {
        var x = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
        var y = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;
        var grid = this.state.grid; 
        grid.forEach(z => {
            if(z.id == e.target.id) {
                z.fill = COLOR_SEA;
            }
        });
        this.setState({
          cursor: { x, y },
          grid
        });
    }

    
    render() {
        return <div ref={this.gameRef} onMouseDown={this.handleMouseDown} onTouchMove={this.handleMouseDown} />;
    }
}

export default Game;