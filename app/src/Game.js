import React from 'react';
import Two from 'two.js';
import Button from '@material-ui/core/Button';
import {COLOR_SKY, COLOR_SEA, COLOR_BROWN, COLOR_YELLOW, SHIP_COLORS} from './Colors';
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.selfRef = React.createRef();
        this.otherRef = React.createRef();
        this.state = {
            cursor: {
                x: 0,
                y: 0    
            },
            play: false,
            self_grid: undefined,
            other_grid: undefined,
            stage: 'place',
            positions: [],
            hit: Array(100).fill(0),
            board_orientation: {},
            ship: {
                type: 0,
                orientation: 'h'
            }
        };
        var params = { width: 410, height: 410 };
        this.self_board = new Two(params)
        this.other_board = new Two(params)
    }

    async commit() {
        const { Battleship } = this.props.drizzle.contracts;
        const { accounts } = this.props.drizzleState;
        const { positions } = this.state;
        const { web3 } = this.props.drizzle;
        var pos = Array(20).fill().map((_, i) => positions[i].i);
        // TODO: Randomize the nonce
        var nonce = 42;
        const eventJsonInterface3 = web3.utils._.find(
            Battleship._jsonInterface,
            o => o.name === 'Commit' && o.type === 'event',
          );
        web3.eth.subscribe('logs', {
            address: Battleship.options.address,
            topics: [eventJsonInterface3.signature]
          }, (error, result, subscribe) => {
              console.log('something');
            if (!error) {
              const eventObj = web3.eth.abi.decodeLog(
                eventJsonInterface3.inputs,
                result.data,
                result.topics.slice(1)
              )
              if(eventObj.addr == accounts[0]) {
                  console.log('nothing');
                subscribe.unsubscribe();
              this.setState({me: eventObj.player, play: eventObj.player == 0});
              if(eventObj.player == 1) {
              const eventJsonInterface4 = web3.utils._.find(
                Battleship._jsonInterface,
                o => o.name === 'MadeMove' && o.type === 'event',
                )
                web3.eth.subscribe('logs', {
                    address: Battleship.options.address,
                    topics: [eventJsonInterface4.signature]
                    }, (error, result, subscribe) => {
                        console.log('something too');
                        if (!error) {
                          const eventObj = web3.eth.abi.decodeLog(
                            eventJsonInterface4.inputs,
                            result.data,
                            result.topics.slice(1)
                          )
                          console.log(eventObj);
                          const x = this.state.positions.find(z => z.i == eventObj.move);
                          const score = x ? x.type : 0;
                          Battleship.methods.reply_move(score).send({from: accounts[0]}, (e,h) => {
                              if(!e) {
                                  this.setState({play: true});
                              }
                          });
                          subscribe.unsubscribe();
                        }
                      });
                    }
                }
            }
          });
        var commitHash = await Battleship.methods.generate_commitment(pos, nonce).call();
        
        var output = await new Promise(resolve => Battleship.methods.commit(commitHash).send({
            from: accounts[0]
        }, (e, h) => {
            if(e) {
                console.log('Error Occured:', e);
                resolve(false);
            } else {
                console.log('Tx Successful:', h);
                this.setState({
                    stage: 'play'
                });
                resolve(true);
            }
        }));
        const { self_grid } = this.state;
        self_grid.forEach((z, idx) => {
            var x = this.state.positions.find(a => a.i == idx);
            if(x) {
                z.fill = SHIP_COLORS[x.type];
            } else {
                z.fill = COLOR_SKY;
            }
        });
        this.setState({self_grid});
        return output;
    }

    endGame = () => {
        const { Battleship } = this.props.drizzle.contracts;
        const { accounts } = this.props.drizzleState;
        const { positions } = this.state;
        const { web3 } = this.props.drizzle;
        var pos = Array(20).fill().map((_, i) => positions[i].i);
        // TODO: Randomize the nonce
        var nonce = 42;
        const eventJsonInterface = web3.utils._.find(
            Battleship._jsonInterface,
            o => o.name === 'Winner' && o.type === 'event',
        );
        web3.eth.subscribe('logs', {
            address: Battleship.options.address,
            topics: [eventJsonInterface.signature]
        }, (error, result) => {
            if (!error) {
                const eventObj = web3.eth.abi.decodeLog(
                    eventJsonInterface.inputs,
                    result.data,
                    result.topics.slice(1)
                  );
                console.log('Winner is', eventObj);
            }
        });
        Battleship.methods.reveal(pos, nonce).send({
            from: accounts[0]
        });
    }

    componentDidMount() {
        // Make an instance of two and place it on the page.
        var elem = this.selfRef.current;
        this.self_board.appendTo(elem);
        elem = this.otherRef.current;
        this.other_board.appendTo(elem);
        // GAME Code goes here !!
        var rect = this.self_board.makeRoundedRectangle(205, 205, 410, 410, 5);

        rect.fill = COLOR_SEA;
        rect.opacity = 0.75;
        rect.noStroke();
        var self_grid = new Array(100);

        for(var i = 0; i < 10; ++i) {
            for(var j = 0; j < 10; ++j) {
                var rect = this.self_board.makeRoundedRectangle(22.75+40.5*i, 22.75 + 40.5*j, 35.5, 35.5, 5);

                rect.fill = COLOR_SKY;
                rect.opacity = 0.75;
                rect.noStroke();
                self_grid[10*i+j] = rect;
            }
        }

        var rect2 = this.other_board.makeRoundedRectangle(205, 205, 410, 410, 5);

        rect2.fill = COLOR_SEA;
        rect2.opacity = 0.75;
        rect2.noStroke();
        var other_grid = new Array(100);

        for (var i = 0; i < 10; ++i) {
            for (var j = 0; j < 10; ++j) {
                var rect2 = this.other_board.makeRoundedRectangle(22.75 + 40.5 * i, 22.75 + 40.5 * j, 35.5, 35.5, 5);

                rect2.fill = COLOR_SKY;
                rect2.opacity = 0.75;
                rect2.noStroke();
                other_grid[10 * i + j] = rect2;
            }
        }
        // Don't forget to tell two to render everything
        // to the screen
        this.self_board.update();
        this.setState({ self_grid });
        this.other_board.update();
        this.setState({ other_grid });
        const { Battleship } = this.props.drizzle.contracts;
        const { web3 } = this.props.drizzle;
        const eventJsonInterface = web3.utils._.find(
            Battleship._jsonInterface,
            o => o.name === 'GameOver' && o.type === 'event',
        );
        const subscription = web3.eth.subscribe('logs', {
            address: Battleship.options.address,
            topics: [eventJsonInterface.signature]
        }, (error) => {
            if (!error) {
                this.endGame();
            }
        });
    }

    componentWillUpdate() {
        this.self_board.update();
        this.other_board.update();
    }

    makeMove = async position => {
        this.setState({play: false});
        const { Battleship } = this.props.drizzle.contracts;
        const { accounts } = this.props.drizzleState;
        const { web3 } = this.props.drizzle;
        console.log('makeMove', position)
        var output = await new Promise(resolve => Battleship.methods.make_move(position).send({ from: accounts[0] },
            (e, h) => {
                if (e) {
                    console.log('Error Occured:', e);
                    resolve(false);
                } else {
                    console.log('Tx Successful:', h);
                    resolve(true);
                }
            }
        ));
        await new Promise(resolve => {
        const eventJsonInterface1 = web3.utils._.find(
            Battleship._jsonInterface,
            o => o.name === 'ReplyMove' && o.type === 'event',
          )
        web3.eth.subscribe('logs', {
            address: Battleship.options.address,
            topics: [eventJsonInterface1.signature]
          }, (error, result, subscribe) => {
            if (!error) {
              const eventObj = web3.eth.abi.decodeLog(
                eventJsonInterface1.inputs,
                result.data,
                result.topics.slice(1)
              )
              if(eventObj.player_index != this.state.me)
                {
                    return;
                }
              subscribe.unsubscribe();
              var { hit } = this.state;
              console.log('eventObj', eventObj);
              hit[eventObj.position] = (parseInt(eventObj.score) == 0) ? 5 : parseInt(eventObj.score);
              console.log('score:', eventObj.score, hit);
              this.setState({hit});
            }
          });

        const eventJsonInterface2 = web3.utils._.find(
        Battleship._jsonInterface,
        o => o.name === 'MadeMove' && o.type === 'event',
        )
        web3.eth.subscribe('logs', {
            address: Battleship.options.address,
            topics: [eventJsonInterface2.signature]
            }, (error, result, subscribe) => {
                if (!error) {
                  const eventObj = web3.eth.abi.decodeLog(
                    eventJsonInterface2.inputs,
                    result.data,
                    result.topics.slice(1)
                  )
                  if(eventObj.player_index == this.state.me)
                  {
                      return;
                  }
                  subscribe.unsubscribe();
                  const x = this.state.positions.find(z => z.i == eventObj.move);
                  const score = x ? x.type : 0;
                  Battleship.methods.reply_move(score).send({from: accounts[0]}, (e,h) => {
                      if(!e) {
                          this.setState({play: true});
                      }
                  });
                }
              });
              resolve();
            });
        return true;
    }

    placeShip = start => {
        const type = this.state.ship.type;
        var positions = this.state.positions;
        var diff = (this.state.ship.orientation == 'h') ? 10 : 1;

        // Toggle ships
        if (start in this.state.board_orientation && this.state.board_orientation[start] != '-') {
            var change = (this.state.board_orientation[start] == 'h') ? 1 : 10;
            var old = (this.state.board_orientation[start] == 'h') ? 10 : 1;
            
            //Toggle can't be made diff type ship
            for (var t = 0; t < positions.length; t++){
                if (positions[t].type != type && positions[t].i == start)
                    return positions;
            }

            // check for bounding ship inside grid
            const last1 = start + (type - 1) * change;
            if ((this.state.board_orientation[start] == 'v' && (last1 / 10) >= 10) || (this.state.board_orientation[start] == 'h' && ~~(last1 / 10) != ~~(start / 10))) {
                return positions;
            }

            //overlapping positions
            for (var i = start + change; i < start + type * change && i < 100; i = i + change) {
                if (i in this.state.board_orientation) {
                    return positions;
                }
            }

            //Removing old positions
            for (var i = start; i < start + type * old && i < 100; i = i + old) {
                this.state.self_grid[i].fill = COLOR_SKY;
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
            // cells alreay occupied
            return positions;                 
        }
            
        //Non toggle case
        else {
            this.state.board_orientation[start] = 'h';
        }
        
        //check for limit ship type
        var count = 0;
        for (var t = 0; t < positions.length; t++) {
            if (positions[t]['type'] == type)
                var count = count + 1;
        }
        if (type == 1 && count / type >= 4) {
            return positions;
        }
        if (type == 2 && count / type >= 3) {
            return positions;
        }
        if (type == 3 && count / type >= 2) {
            return positions;
        }
        if (type == 4 && count / type >= 1) {
            return positions;
        }
            
        // Check for overlapping
        for (var i = start + diff; i < start + type * diff && i < 100; i = i + diff) {
            if (i in this.state.board_orientation) {
                delete this.state.board_orientation[start]
                return positions;
            }
        }
        let ind = 0;
        while (ind < positions.length && positions[ind]['type'] < type)
            ind += 1;

        // Check for bounding ship inside grid
        const last = start + (type - 1) * diff;
        if ((this.state.board_orientation[start] == 'h' && (last / 10) < 10) || (this.state.board_orientation[start] == 'v' && ~~(last / 10) == ~~(start / 10))) {
            // push new positions
            for (var i = start; i < start + type * diff && i < 100; i = i + diff) {
                if (i == start) this.state.board_orientation[i] = this.state.board_orientation[start];
                else this.state.board_orientation[i] = '-';
                positions.splice(ind, 0, { type, i });
                ind += 1;
            }
            return positions;
        }
    }

    handleMouseDown = e => {
        console.log(this.state);
        var x = e.clientX;
        var y = e.clientY;
        var positions = this.state.positions;
        var hit = this.state.hit;
        if(this.state.stage == 'place') {
            var start = this.state.self_grid.findIndex(z => z.id == e.target.id);
            if(start != -1) {
                positions = this.placeShip(start) || this.state.positions;
            }
        }
        
        if (this.state.stage == 'play' && this.state.play) {
            var start = this.state.other_grid.findIndex(z => z.id == e.target.id);
            console.log('start', start);    
            if (start != -1) {
                this.makeMove(start).then(x => {
                    if (x) {
                        hit[start] = 6;
                    }
                });
            }
        }
        this.setState({
            cursor: { x, y },
            positions,
            hit
        });
    }

    handleMouseMove = e => {
        var x = e.clientX;
        var y = e.clientY;
        if(this.state.stage == 'place') {
            var self_grid = this.state.self_grid; 
            var start = self_grid.findIndex(z => z.id == e.target.id);
            if(start != -1) {
                const type = this.state.ship.type;
                const diff = (this.state.ship.orientation == 'h') ? 10 : 1;
                self_grid.forEach((z, idx) => {
                    x = this.state.positions.find(a => a.i == idx);
                    if(x) {
                        z.fill = SHIP_COLORS[x.type];
                    } else {
                        z.fill = COLOR_SKY;
                    }
                });
                for(var i = start; i < start + type*diff && i < 100; i=i+diff) {
                    self_grid[i].fill = COLOR_BROWN;
                }
            }
        }

        if (this.state.stage == 'play' && this.state.play) {
            var other_grid = this.state.other_grid;
            var start = other_grid.findIndex(z => z.id == e.target.id);
            if (start != -1) {
                other_grid.forEach((z, idx) => z.fill = SHIP_COLORS[this.state.hit[idx]]);
                other_grid[start].fill = COLOR_YELLOW;
            }
        }
        this.setState({ cursor: { x, y } });
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
            <Button variant="outlined" onClick={() => this.commit().then(x => console.log(x, 'yay'))}>
                yellow Submarine
            </Button>
            <div>
                <div ref={this.selfRef} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} />
                <div ref={this.otherRef} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} />
            </div>
        </>);
    }
}

export default Game;