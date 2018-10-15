/**
 * Temporary file to test the Mocha Integration
 */
const assert = require('assert');
const request = require('supertest');
const app = require('./../server');

describe('The express app', () => {
    it('handles a GET request to /api', (done) => {
        request(app).get('/api')
                    .end((err, response) => {
                        assert(response.body.hi === 'there');
                        done();
                    });
    });
});
