// make a enum that is either alive or dead
const ALIVE = 1;
const DEAD = 0;
// make a class for the game of life grid with a setup function
class GameOfLifeGrid {
	constructor(x = 50, y = 30) {
		this.makeArray(x, y);
	}

	makeArray(x = 50, y = 30) {
		this.grid = new Array(y);
		// for each item in the array fill it with an empty array of 20 and randomly assign 0 or 1
		for (let i = 0; i < this.grid.length; i++) {
			this.grid[i] = new Array(x);
		}
		this.colorArray = new Array(y);
		for (let i = 0; i < this.colorArray.length; i++) {
			this.colorArray[i] = new Array(x);
		}
	}

	randomizeArray(density_out_of_100 = 50) {
		for (var i = 0; i < this.grid.length; i++) {
			for (var j = 0; j < this.grid[i].length; j++) {
				if (Math.random() < density_out_of_100/100) {
					this.grid[i][j] = ALIVE;
				}

			}
		}
		for (var i = 0; i < this.colorArray.length; i = i+2) {
			for (var j = 0; j < this.colorArray[i].length; j = j+2) {
				this.colorArray[i][j] = Math.floor(Math.random() * 6);
			}
		}
	}

	countNeighbors(x, y, grid = this.grid) {
		var neighbors = 0;
		// check the 8 neighbors using two for loops
		for (var i = -1; i < 2; i++) {
			for (var j = -1; j < 2; j++) {
				// if the neighbor is alive and not the cell itself
				if ((y+i < 0 || x+j < 0) || y+i >= grid.length || x+j >= grid[0].length);
				else if (grid[y + i][x + j] == 1 && !(i == 0 && j == 0)) {
					neighbors++;
				}
			}
		}
		return neighbors;
	}

	colorFromNeighbor(x, y, start = false) {
		if (this.colorArray[y][x] !== undefined && start == true) {
			return this.colorArray[y][x];
		}
		var neighborColor = '';

		for (var i = -1; i < 2; i++) {
			for (var j = -1; j < 2; j++) {
				// if the neighbor is alive and not the cell itself
				if ((y+i < 0 || x+j < 0) || y+i >= this.grid.length || x+j >= this.grid[0].length);
				else if (this.grid[y + i][x + j] == 1 && !(i == 0 && j == 0)) {
					if ((this.colorArray[y + i][x + j] != undefined) && (this.grid[y+i][x+j] == ALIVE)){
						neighborColor = this.colorArray[y + i][x + j];
					}
				}
			}
		}
		if (!neighborColor) {
			this.colorArray[y][x] = Math.floor(Math.random() * 6);
		} else {
			this.colorArray[y][x] = neighborColor;
		}
		return this.colorArray[y][x];
	}

	update() { 
		// clone self
		const old_grid = this.grid.map(function(arr) {
			return arr.slice();
		});
		
		for (var i = 0; i < this.grid.length; i++) {
			for (var j = 0; j < this.grid[i].length; j++) {
				this.grid[i][j] = this.updateCell(this.grid[i][j], this.countNeighbors(j, i, old_grid));
			}
		}

		this.draw();
	}

	draw(start = false) {
		// Get the grid element
		var grid = document.getElementById('grid');
		
		// Remove all child elements from the grid
		while (grid.firstChild) {
			grid.removeChild(grid.firstChild);
		}

		// Loop through the array and create a box for each item
		for (var i = 0; i < this.grid.length; i++) {
			for (var j = 0; j < this.grid[i].length; j++) {
				// Create a new box element
				var box = document.createElement('div');
				// Set the box class to "box"
				box.className = 'box';
				// Set the box background color to red if the value is 0, white otherwise
				box.className += this.grid[i][j] === 1 ? [' red', ' orange', ' yellow', ' green', ' blue', ' purple'][this.colorFromNeighbor(i,j, start)] : '';
				// Add the box to the grid
				grid.appendChild(box);
			}
			// Add a line break after each row
			grid.appendChild(document.createElement('br'));
		}
	}

	updateCell(cell, numNeighbors){
		// write a match statement for less than two, more than three, and two or three
		switch (numNeighbors) {
			case 0 | 1: return DEAD;
			case 2: return cell;
			case 3: return ALIVE;
			default: return DEAD;
		}
	}
}