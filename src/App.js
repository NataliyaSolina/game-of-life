import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class Cell extends React.Component {
	selectCell = () => {
		this.props.selectCell(this.props.row, this.props.col);
	}
	render() {
		return (
			<div
				className={this.props.CellClass}
				id={this.props.id}
				onClick={this.selectCell}
			/>
		);
	}
}

class Grid extends React.Component {
	render() {
		const width = (this.props.cols * 21 + 1);
		var rowsArr = [];

		var CellClass = "";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let CellId = i + "_" + j;

				CellClass = this.props.grid[i][j] ? "cell on" : "cell off";
				rowsArr.push(
					<Cell
						CellClass={CellClass}
						key={CellId}
						CellId={CellId}
						row={i}
						col={j}
						selectCell={this.props.selectCell}
					/>
				);
			}
		}

		return (
			<div className="grid" style={{width: width}}>
				{rowsArr}
			</div>
		);
	}
}

class Buttons extends React.Component {
	render() {
		return (
			<div className="buttons">
                <button onClick={this.props.playButton}>Play</button>
                <button onClick={this.props.pauseButton}>Stop</button>
                <button onClick={this.props.clear}>Clear</button>
                <button onClick={this.props.random}>Random</button>
			</div>
			)
	}
}

class App extends React.Component {
	constructor() {
		super();
		this.speed = 500;
		this.rows = 20;
		this.cols = 20;

		this.state = {
			generation: 0,
			grid: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
		}
	}

	selectCell = (row, col) => {
		let gridCopy = arrayClone(this.state.grid);
		gridCopy[row][col] = !gridCopy[row][col];
		this.setState({
			grid: gridCopy
		});
	}

	random = () => {
		let gridCopy = arrayClone(this.state.grid);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if (Math.random() < 0.3) {
					gridCopy[i][j] = true;
				}
			}
		}
		this.setState({
			grid: gridCopy
		});
	}

	playButton = () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play, this.speed);
	}

	pauseButton = () => {
		clearInterval(this.intervalId);
	}

	clear = () => {
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			grid: grid,
			generation: 0
		});
	}

	play = () => {
		let g = this.state.grid;
		let g2 = arrayClone(this.state.grid);

		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    // if (i > 0) if (g[i - 1][j]) count++;
		    // if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    // if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    // if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    // if (j > 0) if (g[i][j - 1]) count++;
		    // if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    // if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
			// if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
			
			if (select(g, i - 1, j, this.rows, this.cols)) count++;
		    if (select(g, i - 1, j - 1, this.rows, this.cols)) count++;
		    if (select(g, i - 1, j + 1, this.rows, this.cols)) count++;
		    if (select(g, i, j + 1, this.rows, this.cols)) count++;
		    if (select(g, i, j - 1, this.rows, this.cols)) count++;
		    if (select(g, i + 1, j, this.rows, this.cols)) count++;
		    if (select(g, i + 1, j - 1, this.rows, this.cols)) count++;
			if (select(g, i + 1, j + 1, this.rows, this.cols)) count++;
			console.log(i,j,count);
		
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
			if (!g[i][j] && count === 3) g2[i][j] = true;
			console.log(g2);
		  }
		}
		this.setState({
		  grid: g2,
		  generation: this.state.generation + 1
		});

	}

	componentDidMount() {
		this.random();
		this.playButton();
	}

	render() {
		return (
            <div className="container">
                <div className="menu">
                    <h1>Игра жизнь</h1>
                    <Buttons
                        playButton={this.playButton}
                        pauseButton={this.pauseButton}                        
                        clear={this.clear}
                        random={this.random}                        
                    />
                    <h2>Поколение: {this.state.generation}</h2>
                </div>    
                <Grid
                    grid={this.state.grid}
                    rows={this.rows}
                    cols={this.cols}
					selectCell={this.selectCell}
					
                />
            </div>
		);
	}
}
function select(arr, r, c, row, col) {
	if(r == -1) {r = row - 1}
	if(r == row) {r = 0}

	if(c == -1) {c = col - 1}
	if(c == col) {c = 0}
	return arr[r][c];
}
function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}

export default App;
