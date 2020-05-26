import React, { Component } from "react";
import "./css/Game.css";

const cellSize = 1;
const width = 25;
const height = 25;

export default class Game extends Component {
  render() {
    return (
      <>
        <div>
          <div className="board" style={{ width: width, height: height }}></div>
        </div>
      </>
    );
  }
}
