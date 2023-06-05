const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const wrongPuzzle = '1.5..2.84..63.12.7.2..5..a..9..2....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const complete = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', done => {
        assert.equal(solver.validate(puzzle), true);
        done();
    });
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', done => {
        assert.equal(solver.validate(wrongPuzzle).error, 'Invalid characters in puzzle');
        done();
    });
    test('Logic handles a puzzle string that is not 81 characters in length', done => {
        assert.equal(solver.validate('a').error, 'Expected puzzle to be 81 characters long');
        done();
    });
    test('Logic handles a valid row placement', done => {
        assert.equal(solver.checkRowPlacement(puzzle, 'A', '1', '1'), true);
        done();
    });
    test('Logic handles an invalid row placement', done => {
        assert.equal(solver.checkRowPlacement(puzzle, 'A', '1', '2'), false);
        done();
    });
    test('Logic handles a valid column placement', done => {
        assert.equal(solver.checkColPlacement(puzzle, 'A', '1', '1'), true);
        done();
    });
    test('Logic handles an invalid column placement', done => {
        assert.equal(solver.checkColPlacement(puzzle, 'A', '1', '3'), false);
        done();
    });
    test('Logic handles a valid region (3x3 grid) placement', done => {
        assert.equal(solver.checkRegionPlacement(puzzle, 'A', '1', '1', true), true);
        done();
    });
    test('Logic handles an invalid region (3x3 grid) placement', done => {
        assert.equal(solver.checkRegionPlacement(puzzle, 'A', '1', '9'), false);
        done();
    });
    test('Valid puzzle strings pass the solver', done => {
        assert.equal(solver.solve(puzzle), complete);
        done();
    });
    test('Invalid puzzle strings fail the solver', done => {
        assert.equal(solver.solve(wrongPuzzle), false);
        done();
    });
    test('Solver returns the expected solution for an incomplete puzzle', done => {
        assert.equal(solver.solve(puzzle), complete);
        done();
    });
});
