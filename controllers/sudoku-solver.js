//Constants
const { transform } = require("@babel/core");
const EMPTY  = '.';
const possibleNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const letterToNumber = {
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3,
  'E': 4,
  'F': 5,
  'G': 6,
  'H': 7,
  'I': 8
}

class SudokuSolver {
  
  puzzleToArray(puzzleString) {
    let valueIndex = 0;
    let result = [];
    //Iterate valueIndex until reacj puzzleString.length
    while(valueIndex != puzzleString.length){
      let row = [];
      //Insert 9 characters in row
      for(let value = 0; value <= 8; value++){
          row.push(puzzleString[valueIndex]);
          valueIndex++;
      }
      //Insert row in result
      result.push(row);
    }
    return result;
  }

  isValidToInsert (number, row, col, board) {
    //Check if number exists in row and col
    for(let i = 0; i < board.length; i++){
      if (board[row][i] === number || board[i][col] === number){
        return false;
      }
    }
    //Check if number exists in 3x3 matrix
    let startRow = Math.floor(row / 3) * 3;
    let startColumn = Math.floor(col / 3) * 3;

    for(let i = startRow; i < startRow + 3; i++){
      for(let j = startColumn; j < startColumn + 3; j++){
        if (board[i][j] === number){
          return false;
        }
      }
    }
    //If number doesn't exists in any return true
    return true;
  }

  getEmptySpaces (board) {
    let emptySpaces = [];
    //Iterate through all cells
    for (let i = 0; i < board.length; i++){
      for(let j = 0; j < board.length; j++){
        //If the value of a cell is EMPTY
        if (board[i][j] === EMPTY){
          //Insert row and col position into emptySpaces array
          emptySpaces.push({row: i, col: j});
        }
      }
    }
    return emptySpaces;
  }

  getBoardAndCheckCell(puzzleString, row, column, number){
    //Create Board
    let board = this.puzzleToArray(puzzleString);
    //Check if Cell Value is Worthy
    switch(board[row][column-1]){
      //If value is EMPTY return false to be reviewed
      case EMPTY:
        return {board, result: false};
      //If value is the same as number return true and end process
      case number:
        return {board, result: true};
      //If value is not EMPTY and is different than value return null
      default:
        return {board, result: null};
    }
  }

  transformBack(board) {
    //Flat array and join without separator
    return board.flat().join("");
  }

  validate(puzzleString) {
    if(!puzzleString){
      return {error: "Required field missing"};
    }
    if (puzzleString.length != 81){
      return {error: "Expected puzzle to be 81 characters long"};
    }
    if (/[^0-9.]/g.test(puzzleString)){
      return {error: "Invalid characters in puzzle"};
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    //Convert row letter to row number
    row = letterToNumber[row.toUpperCase()];
    //Get results from getBoardAndCheckCell
    let { board, result } = this.getBoardAndCheckCell(puzzleString, row, column, value);
    switch (result){
      //If result is true
      case true:
        //Return true as value to check is the same as the value from puzzle
        return true;
      //If result is false
      case false:
        //Check if value already exists in row
        for(let i = 0; i < 9; i++){
          if (board[row][i] == value){
            return false;
          }
        }
        //If value does not exists in row return true
        return true;
      //If result is null
      case null:
        return false;
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    //Same as checkRowPlacement
    row = letterToNumber[row.toUpperCase()];
    let { board, result } = this.getBoardAndCheckCell(puzzleString, row, column, value);
    switch (result){
      case true:
        return true;
      case false:
        for(let i = 0; i < 9; i++){
          //Instead of checking each column, check each row
          if (board[i][column-1] == value){
            return false;
          }
        }
        return true;
      case null:
        return false;
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    //Same as checkRowPlacement
    row = letterToNumber[row.toUpperCase()];
    let { board, result } = this.getBoardAndCheckCell(puzzleString, row, column, value);
    switch (result){
      case true:
        return true;
      case false:
        let startRow = Math.floor(row / 3) * 3;
        let startColumn = Math.floor(column / 3) * 3;
        //Iterate through each cell in region
        for(let i = startRow; i < startRow + 3; i++){
          for(let j = startColumn; j < startColumn + 3; j++){
            //If value exists in region return false
            if (board[i][j] === value){
              return false;
            }
          }
        }
        //If number doesn't exists return true
        return true;
      case null:
        return false;
    }

    
  }

  solve(puzzleString) {
    //Translate puzzleString into an Array
    let board = this.puzzleToArray(puzzleString);
    //Get Empty Spaces
    let emptySpaces = this.getEmptySpaces(board);
    //Try Numbers Function
    const tryNumbers = (emptySpaceIndex) => {
      //Function will be finished once emptySpaceIndex reach the total emptySpaces
      if (emptySpaceIndex >= emptySpaces.length){
        return true;
      }
      //Get row and col positions from emptySpaces array of objects
      const {row, col} = emptySpaces[emptySpaceIndex];
      //Try to fill the empty spaces with any number from possibleNumbers
      for(let i = 0; i < possibleNumbers.length; i++){
        //Use i as index from possibleNumbers Array
        let number = possibleNumbers[i];
        //Check if number is valid to insert
        if(this.isValidToInsert(number, row, col, board)){
          //If is valid insert number into board
          board[row][col] = number;
          //Recurse to the next emptySpace to solve until all returns true
          if(tryNumbers(emptySpaceIndex + 1)){
            //true will finish the recursion
            return true;
          }
          //If recurseNumbers return false reset board value to EMPTY to try again
          board[row][col] = EMPTY;
        }
      }
      //If puzzle cannot be solved return false
      return false;
    }
    //Start recursion from position 0 and check if returns true when solved or false when not solved
    if(tryNumbers(0)){
    //Transform board back to string and return result
    let result = this.transformBack(board);
    return result;
    } else {
      //If tryNumbers returns false, puzzle cannot be solved
      return false;
    }
  }
}

module.exports = SudokuSolver;

