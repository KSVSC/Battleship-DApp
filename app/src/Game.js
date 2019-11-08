import React from 'react';
import Two from 'two.js';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.gameRef = React.createRef();
    }

    componentDidMount() {
        // Make an instance of two and place it on the page.
        var elem = this.gameRef.current;
        var params = { width: 285, height: 200 };
        var two = new Two(params).appendTo(elem);
        // GAME Code goes here !!
        // two has convenience methods to create shapes.
        var circle = two.makeCircle(72, 100, 50);
        var rect = two.makeRectangle(213, 100, 100, 100);

        // The object returned has many stylable properties:
        circle.fill = '#FF8000';
        circle.stroke = 'orangered'; // Accepts all valid css color
        circle.linewidth = 5;

        rect.fill = 'rgb(0, 200, 255)';
        rect.opacity = 0.75;
        rect.noStroke();

        // Don't forget to tell two to render everything
        // to the screen
        two.update();
    }

    render() {
        return <div ref={this.gameRef} />;
    }
}

export default Game;