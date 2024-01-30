const worldState = {
    started: false,
    scaleFactor: 25,
    speed: 2
}

class Square {
    constructor(x, y, worldState, ctx){
        this.x = x;
        this.y = y;
        this.worldState = worldState;
        this.ctx = ctx;

        this.alive = false;
        this.futureAlive = false;
        this.neighbours = [];
    }

    addNeighbour(neighbour){
        this.neighbours.push(neighbour);
    }

    makeAlive(){
        this.alive = true;
        this.futureAlive = true;
    }

    kill(){
        this.alive = false;
        this.futureAlive = false;
    }

    updateAlive(){
        this.alive = this.futureAlive;
    }

    freeze(){
        this.futureAlive = this.alive;
    }

    update() {
        if (!this.worldState.started) return;

        const populatedNeighbours = this.neighbours.filter(el => el.alive);
        if (this.alive) {
            if (populatedNeighbours.length <= 1 || populatedNeighbours.length >= 4) {
                this.futureAlive = false;
            } 
        } else {
            if (populatedNeighbours.length === 3) {
                this.futureAlive = true;
            }
        }
    }

    draw(){
        if (this.alive) {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.x * this.worldState.scaleFactor, 
                                this.y * this.worldState.scaleFactor, 
                                this.worldState.scaleFactor, 
                                this.worldState.scaleFactor);
        } else {
            this.ctx.clearRect(this.x * this.worldState.scaleFactor, 
                                this.y * this.worldState.scaleFactor, 
                                this.worldState.scaleFactor, 
                                this.worldState.scaleFactor);
        }
    }
}

class Canvas{
    constructor(worldState){
        this.worldState = worldState;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.rect = this.canvas.getBoundingClientRect();

        this.globalWidth = 500;
        this.globalHeight = 500;
        this.localWidth = Math.floor(this.globalWidth / this.worldState.scaleFactor);
        this.localHeight = Math.floor(this.globalHeight / this.worldState.scaleFactor);

        this._initSquares();
        this._initMouseListener();
    }

    _initSquares(){
        // Create empty squares array
        this.squares = Array.from({ length: this.localWidth }, () => 
                            new Array(this.localHeight).fill(undefined));


        // Fill with Squares
        for(let x = 0; x < this.localWidth; x++){
            for(let y = 0; y < this.localHeight; y++){
                this.squares[x][y] = new Square(x, 
                                                y,
                                                this.worldState, 
                                                this.ctx)
            }
        }

        // Init neighbours
        for(let x = 0; x < this.localWidth; x++){
            for(let y = 0; y < this.localHeight; y++){
                const possibleNeighbours = [[x + 1, y], [x - 1, y], 
                                            [x, y + 1], [x, y - 1], 
                                            [x + 1, y + 1], [x + 1, y - 1], 
                                            [x - 1, y + 1], [x - 1, y - 1]];

                possibleNeighbours.forEach(coor => {
                    if (coor[0] >= 0 && coor[1] >= 0 && coor[0] < this.localWidth && coor[1] < this.localHeight){
                        this.squares[x][y].addNeighbour(this.squares[coor[0]][coor[1]]);
                    }
                });
            }
        }
    }

    _initMouseListener(){
        document.addEventListener("click", (event) => {
            const [x, y] = [event.clientX - this.rect.left, event.clientY - this.rect.top];
        
            if (x < 0 || y < 0 || x >= this.globalWidth || y >= this.globalHeight){
                return;
            }
        
            const [scaleX, scaleY] = [Math.floor(x / this.worldState.scaleFactor), 
                                        Math.floor(y / this.worldState.scaleFactor)];  
            this.squares[scaleX][scaleY].alive ? 
                this.squares[scaleX][scaleY].kill() :   
                this.squares[scaleX][scaleY].makeAlive();
        })
    }

    clear(){
        this._initSquares();
    }

    freeze(){
        this.squares.forEach(row => {
            row.forEach(el => {
                el.freeze();
            });
        });
    }

    update(){
        this.localWidth = Math.floor(this.globalWidth / this.worldState.scaleFactor);
        this.localHeight = Math.floor(this.globalHeight / this.worldState.scaleFactor);

        this.squares.forEach(row => {
            row.forEach(el => {
                el.updateAlive();
            });
        });

        this.squares.forEach(row => {
            row.forEach(el => {
                el.update();
            });
        });
    }

    draw(){
        // Draw squares
        this.squares.forEach(row => {
            row.forEach(el => el.draw());
        });

        // Draw grid
        this.ctx.strokeStyle = 'grey';
        this.ctx.lineWidth = Math.max(1, Math.floor(this.worldState.scaleFactor / 10));

        // Draw vertical lines
        for(let x = 0; x <= this.localWidth; x++){
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.worldState.scaleFactor, 0);
            this.ctx.lineTo(x * this.worldState.scaleFactor, this.globalHeight);
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for(let y = 0; y <= this.localHeight; y++){
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.worldState.scaleFactor);
            this.ctx.lineTo(this.globalWidth, y * this.worldState.scaleFactor);
            this.ctx.stroke();
        }
    }
}

const myCanvas = new Canvas(worldState);


const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const clearButton = document.getElementById('clear');
const scaleInput = document.getElementById('scale');
const speedInput = document.getElementById('speed');

startButton.addEventListener('click', () => worldState.started = true);
stopButton.addEventListener('click', () => {
    worldState.started = false
    myCanvas.freeze();
});
clearButton.addEventListener('click', () => myCanvas.clear());
scaleInput.oninput = function() {
    worldState.scaleFactor = this.value;
}
speedInput.oninput = function() {
    worldState.speed = this.value;
}


let lastTime = 0;
function mainLoop(timestamp){
    if (timestamp - lastTime > 1000 / worldState.speed){
        lastTime = timestamp
        myCanvas.update();
        myCanvas.draw();
    }
    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);