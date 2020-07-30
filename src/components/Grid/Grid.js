import React, { useState, useCallback, useRef } from "react";
import { pulsar, spaceship, rain, circleOfFire } from "./presets.js";
import produce from "immer";

const numRows = 25;
const numCols = 30;

const speeds = {
  slow: 1000,
  normal: 300,
  fast: 100,
};

const presetContainer = {
  prePulsar: pulsar,
  preSpace: spaceship,
  preRain: rain,
  preCircle: circleOfFire,
};

const colors = {
  cyan: "cyan",
  red: "red",
  orange: "orange",
  lime: "lime",
};

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const Grid = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState("slow");
  const [gen, setGen] = useState(0);
  const [color, setColor] = useState("cyan");

  // refrences to make state setting easier
  const runningRef = useRef();
  runningRef.current = running;

  const speedRef = useRef();
  speedRef.current = speed;

  const gridRef = useRef();
  gridRef.current = grid;

  const colorRef = useRef();
  colorRef.current = color;

  const handleSpeed = (e) => {
    setSpeed(e.target.value);
  };

  const handleColor = (e) => {
    setColor(e.target.value);
  };

  const handlePreset = (e) => {
    let presetName = e.target.value;
    setGen(0);
    setRunning(false);

    if (presetName === "None") {
      setGrid(generateEmptyGrid());
    } else {
      setGrid(presetContainer[presetName]);
    }
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGen((generation) => {
      return (generation = generation + 1);
    });
    // uses current grid: g to make a gridCopy, then after all calculations are made
    // makes gridCopy the current grid.
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            // uses operations above to calculate the 8 surrounding neighor nodes
            operations.forEach(([x, y]) => {
              const newI = (i + x + numRows) % numRows;
              const newK = (k + y + numCols) % numCols;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });
            // calculates whether a node should become alive, dead, or be left alone.
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, speeds[speedRef.current]);
  }, []);

  return (
    <>
      {/* <button
            onClick={() => {
                console.log(grid)
            }}>
              Print</button> */}
      <label
        htmlFor="speeds"
        style={{
          padding: "5px",
        }}
      >
        Speeds
      </label>
      <select className="speeds" id="speeds" onChange={handleSpeed}>
        <option value="slow">Slow</option>
        <option value="normal">Normal</option>
        <option value="fast">Fast</option>
      </select>
      <label
        htmlFor="presets"
        style={{
          padding: "5px",
        }}
      >
        Presets
      </label>
      <select className="presets" id="presets" onChange={handlePreset}>
        <option value="None">Empty</option>
        <option value="prePulsar">Pulsar</option>
        <option value="preSpace">Space Ship</option>
        <option value="preRain">Rain</option>
        <option value="preCircle">Circle of Fire</option>
      </select>
      <label
        htmlFor="color"
        style={{
          padding: "5px",
        }}
      >
        Node Color
      </label>
      <select className="color" id="color" onChange={handleColor}>
        <option value="cyan">Cyan</option>
        <option value="red">Red</option>
        <option value="orange">Orange</option>
        <option value="lime">Lime</option>
      </select>
      <br />
      <p>Generation: {gen}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          justifyContent: "center",
        }}
        className="grid"
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                if (!running) {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k]
                  ? colors[colorRef.current]
                  : undefined,
                border: "solid 1px white",
              }}
            />
          ))
        )}
      </div>
      <div
        classname='buttons'
        style={{
          paddingBottom: "2px",
        }}
      >
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
            setGen(0);
            setRunning(false);
          }}
        >
          Clear
        </button>
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0))
              );
            }
            setGrid(rows);
            setGen(0);
            setRunning(false);
          }}
        >
          Randomize
        </button>
        <button
          onClick={() => {
            if (!running) {
              runningRef.current = true;
              runSimulation();
              runningRef.current = false;
            }
          }}
        >
          next stage
        </button>
      </div>
    </>
  );
};

export default Grid;
