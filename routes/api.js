'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //Get data from req.body
      const {puzzle, coordinate, value} = req.body;
      //If any data is falsey return error
      if (!puzzle || !coordinate || !value){
        return res.json({error: "Required field(s) missing"});
      }
      //Get row and column from coordinates
      const row = coordinate.split("")[0];
      const column = coordinate.split("")[1];
      //If coordinate is longer than 2 characters
      //Row contain a letter different to a-i
      //Column contain a number different to 1-9
      //return error
      if(coordinate.length !== 2 || !/[a-i]/i.test(row) || !/[1-9]/i.test(column)){
        return res.json({error: "Invalid coordinate"});
      }
      //If value is longer than 1 character or contains a number different to 1-9 return error
      if(!/[1-9]/.test(value) || value.length != 1){
        return res.json({error: "Invalid value"});
      }
      
      //Validate Puzzle
      let validatedPuzzle = solver.validate(puzzle);
      if(validatedPuzzle != true){
        return res.json(validatedPuzzle);
      }

      //Check rows, cols and regions
      let validCol = solver.checkColPlacement(puzzle, row, column, value);
      let validRow = solver.checkRowPlacement(puzzle, row, column, value);
      let validRegion = solver.checkRegionPlacement(puzzle, row, column, value);
      let conflicts = [];
      //If rows, cols and regions are true return valid
      if(validCol && validRow && validRegion){
        return res.json({valid: true});
      } else {
        //If not insert in conflicts the ones that return false
        if (!validCol) conflicts.push('column');
        if (!validRow) conflicts.push('row');
        if (!validRegion) conflicts.push('region')
        //Return conflicts
        return res.json({valid: false, conflict: conflicts});
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      //Get puzzle from req.bocy
      const { puzzle } = req.body;
      //Validate Puzzle
      let validatedString = solver.validate(puzzle);
      //If validatedString is true the puzzle is worthy
      if(validatedString != true){
        //If not return the error
        return res.json(validatedString);
      }
      //Solve puzzle
      let solvedString = solver.solve(puzzle);
      //If solvedString returns false
      if(!solvedString){
        return res.json({error: "Puzzle cannot be solved"});
      } else {
        //If solvedString returns a string
        return res.json({solution: solvedString});
      }
    });
};
