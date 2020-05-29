import React, { Component } from "react";
import { ButtonToolbar } from "react-bootstrap";
import ReactDOM from "react-dom";
import "./index.css";

class Box extends Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  };

  render() {
    const { boxClass, id } = this.props;
    return <div className={boxClass} id={id} onClick={this.selectBox} />;
  }
}

class Grid extends Component {
  render() {
    const { cols, rows, gridFull, selectBox } = this.props;
    const width = cols * 16;
    var rowsArr = [];

    var boxClass = "";
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        let boxId = `${i}_${j}`;
        boxClass = gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={selectBox}
          />
        );
      }
    }
    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    );
  }
}

export default class Buttons extends Component {
  render() {
    const { playButton, pauseButton, slower, faster, clear, seed } = this.props;
    return (
      <div className="center">
        <ButtonToolbar>
          <button className="btn btn-default" onClick={playButton}>
            Play
          </button>
          <button className="btn btn-default" onClick={pauseButton}>
            Pause
          </button>
          <button className="btn btn-default" onClick={slower}>
            Slower
          </button>
          <button className="btn btn-default" onClick={faster}>
            Faster
          </button>
          <button type="button" className="btn btn-danger" onClick={clear}>
            Clear
          </button>
          <button className="btn btn-default" onClick={seed}>
            Seed
          </button>
        </ButtonToolbar>
      </div>
    );
  }
}

class Main extends Component {
  constructor(props) {
    super(props);

    this.speed = 50;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generation: 0,
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false)),
      playing: false,
    };
  }

  selectBox = (row, col) => {
    if (!this.state.playing) {
      let gridCopy = JSON.parse(JSON.stringify(this.state.gridFull));
      gridCopy[row][col] = !gridCopy[row][col];
      this.setState({
        gridFull: gridCopy,
      });
    }
  };

  seed = () => {
    if (!this.state.playing) {
      let gridCopy = JSON.parse(JSON.stringify(this.state.gridFull));
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          if (Math.floor(Math.random() * 10) === 1) gridCopy[i][j] = true;
        }
      }
      this.setState({
        gridFull: gridCopy,
      });
    }
  };

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
    this.setState({ playing: true });
  };

  pauseButton = () => {
    clearInterval(this.intervalId);
    this.setState({ playing: false });
  };

  slower = () => {
    this.speed = this.speed + 50;
    this.playButton();
  };

  faster = () => {
    this.speed = this.speed - 50;
    this.playButton();
  };

  clear = () => {
    this.setState({
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false)),
      generation: 0,
    });
    this.pauseButton();
  };

  play = () => {
    let g = this.state.gridFull;
    let g2 = JSON.parse(JSON.stringify(this.state.gridFull));

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++; //up-left
        if (i > 0) if (g[i - 1][j]) count++; //up
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++; //up-right
        if (j < this.cols - 1) if (g[i][j + 1]) count++; //right
        if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++; //down-right
        if (i < this.rows - 1) if (g[i + 1][j]) count++; //down
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++; //down-left
        if (j > 0) if (g[i][j - 1]) count++; //left
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false; //live with 0-1 or more than 3 neighbors die next gen
        if (!g[i][j] && count === 3) g2[i][j] = true; //dead and 3 live neighbors then repopulate
      }
    }
    this.setState({ gridFull: g2, generation: this.state.generation + 1 });
  };

  componentDidMount() {
    this.seed();
    this.playButton();
  }

  render() {
    return (
      <div>
        <h1>Game of Life</h1>
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slower={this.slower}
          faster={this.faster}
          clear={this.clear}
          seed={this.seed}
          gridSize={this.gridSize}
        />
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
