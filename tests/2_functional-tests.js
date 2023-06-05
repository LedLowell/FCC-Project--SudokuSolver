const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
const wrongCharPuzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4...a.5.2.......4..8916..85.72...3';
const wrongPuzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.5.....4..8916..85.72...3'
const complete = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: puzzle
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, complete);
                done();
            });
    });
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
    });
    test('Solve a puzzle with invalid characters: POST request to /api/solve', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: wrongCharPuzzle})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            })
    });
    test('Solve a puzzle with incorrect length: POST request to /api/solve', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: 'a'})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: wrongPuzzle
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Puzzle cannot be solved");
                done();
            });
    });
    test('Check a puzzle placement with all fields: POST request to /api/check', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: puzzle,
                coordinate: 'A1',
                value: '5'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, true);
                done();
            });
    });
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: puzzle,
                coordinate: 'A2',
                value: '1'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 1);
                done();
            });
    });
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: puzzle,
                coordinate: 'A2',
                value: '2'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 2);
                done();
            });
    });
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: puzzle,
                coordinate: 'A2',
                value: '5'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 3);
                done();
            });
    });
    test('Check a puzzle placement with missing required fields: POST request to /api/check', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: puzzle,
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });
    test('Check a puzzle placement with invalid characters: POST request to /api/check', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: wrongCharPuzzle,
                coordinate: 'A1',
                value: '1'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });
    test('Check a puzzle placement with incorrect length: POST request to /api/check', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: 'a',
                coordinate: 'A1',
                value: '1'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: puzzle,
                coordinate: 'Z1',
                value: '1'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
            });
    });
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: puzzle,
                coordinate: 'A1',
                value: '23'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid value');
                done();
            });
    });
});

