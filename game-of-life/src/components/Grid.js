import React, { useState, useCallback, useRef } from 'react';
import { pulsar } from '../presets/pulsar.js';
import { spaceship } from '../presets/spaceship.js';
import { rain } from '../presets/rain.js'
import produce from 'immer';

const numRows = 25;
const numCols = 30;


const speeds = {
    slow: 800,
    normal: 200,
    fast: 50,
};

const presetContainer = {
    prePulsar: pulsar,
    preSpace: spaceship,
    preRain: rain
}

const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
];

const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows;
}

const Grid = () => {
    const [grid, setGrid] = useState(() => {
        return generateEmptyGrid()
      });

      const [running, setRunning]= useState(false)

      const [speed, setSpeed] = useState("slow")

      const [gen, setGen]= useState(0)

      const runningRef = useRef();
      runningRef.current = running;

      const speedRef = useRef();
      speedRef.current = speed;

      const gridRef = useRef()
      gridRef.current = grid;

      const handleSpeed = (e) => {
        setSpeed(e.target.value);
        };
        
        const handleChange = (e) => {
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
        setGen(generation => {
            return generation = generation + 1;
        })
        setGrid((g) => {
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++) {
                    for (let k = 0; k < numCols; k++) {
                        let neighbors = 0;
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newK = k + y;
                            if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                                neighbors += g[newI][newK]
                            }
                        })
                        if(neighbors < 2 || neighbors > 3) {
                            gridCopy[i][k] = 0;
                        } else if (g[i][k] === 0 && neighbors === 3) {
                            gridCopy[i][k] = 1;
                        }
                    }
                }
            })
        })
        setTimeout(runSimulation, speeds[speedRef.current]);
      }, [])

      return (
          <>
          {/* <button
            onClick={() => {
                console.log(grid)
            }}>
              Print</button> */}
                <label htmlFor="speeds">Speeds</label>
                <select
                    className="speeds"
                    id="speeds"
                    onChange={handleSpeed}>
                    <option value="slow">slow</option>
                    <option value="normal">normal</option>
                    <option value="fast">fast</option>
                </select>
                <label htmlFor="presets">Presets</label>
                <select
                    className="presets"
                    id="presets"
                    onChange={handleChange}>

                    <option value="None">...</option>
                    <option value="prePulsar">Pulsar</option>
                    <option value="preSpace">Space Ship</option>
                    <option value="preRain">Rain</option>
                </select>
          <button
            onClick={() => {
                setRunning(!running);
                if (!running){
                    runningRef.current = true;
                    runSimulation();
                }
            }}>
              {running ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={() => {
                setGrid(generateEmptyGrid());
                setGen(0);
                setRunning(false)
            }}>
                Clear
            </button>
            <button
              onClick={() => {
                const rows = [];
                for (let i = 0; i < numRows; i++) {
                  rows.push(Array.from(Array(numCols), () => Math.random() > 0.8 ? 1 : 0))
                }
                setGrid(rows);
                setGen(0);
                setRunning(false)
              }}>
                Randomize
              </button>
              <button
                onClick={() => {
                    if (!running){
                        runningRef.current = true;
                        runSimulation()
                        runningRef.current = false;
                    }
                }}>
                  next stage
              </button>
            <p>Generation: {gen}</p>
          <div style ={{
              display: 'grid',
              gridTemplateColumns: `repeat(${numCols}, 20px)`,
              justifyContent: 'center'
          }} 
            className="grid">
              {grid.map((rows, i) =>
                rows.map((col, k) => (
                    <div
                        key={`${i}-${k}`}
                        onClick={() => {
                            const newGrid = produce(grid, gridCopy => {
                                gridCopy[i][k] = grid[i][k] ? 0 : 1;
                            })
                            setGrid(newGrid)
                        }}
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: grid[i][k] ? 'cyan' : undefined,
                            border: 'solid 1px black'
                        }}
                    />
                ))
            )}
          </div>
          </>
      )
}

export default Grid;