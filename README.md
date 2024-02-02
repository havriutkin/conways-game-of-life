# Conway's Game of Life

Conway's Game of Life is a cellular automaton devised by the British mathematician John Horton Conway in 1970. 
It's a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input from human players. 
The game is played on an infinite two-dimensional grid of square cells, each of which is in one of two possible states, alive or dead.
Every cell interacts with its eight neighbors, which are the cells adjacent to it horizontally, vertically, or diagonally.

## Rules

The game evolves in turns, often referred to as ticks or steps. At each step, the following transitions occur:

1. **Birth:** A dead cell with exactly three live neighbors becomes a live cell.
2. **Death by isolation:** A live cell with fewer than two live neighbors dies.
3. **Death by overcrowding:** A live cell with more than three live neighbors dies.
4. **Survival:** A live cell with two or three live neighbors continues to live.

## Implementation

The provided code implements Conway's Game of Life in a web environment using JavaScript and HTML5 Canvas for rendering. Here's a brief overview of the implementation details:

### World State

- `worldState`: An object holding the game's state, including whether the game has started, the scale factor for cells, and the game's speed.

### Square Class

- Represents each cell in the grid.
- Holds its own state (alive or dead), its position, and a list of neighboring cells.
- Can update its state based on the game's rules.

### Canvas Class

- Manages the rendering of the game on a canvas.
- Handles mouse events to allow users to interact with the game by clicking cells to toggle their state.
- Updates the game state and redraws the grid at each step.

### User Interaction

- Start, stop, and clear buttons allow control over the game's flow.
- Input fields for scale and speed let users customize the appearance and evolution speed of the game.

### Game Loop
- The `mainLoop` function drives the game's updates and rendering, using `requestAnimationFrame` for smooth animation.
