import React from 'react';
import Two from 'two.js';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        // Make an instance of two and place it on the page.
        var elem = this.myRef.current;
        var params = { width: 285, height: 200 };
        var two = new Two(params).appendTo(elem);

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
        return <div ref={this.myRef} />;
    }
}

export default Player;