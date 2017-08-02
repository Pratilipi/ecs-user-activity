var chai = require( 'chai' );
var chaiHttp = require('chai-http');
var server = require('../src/server');
var should = chai.should();

chai.use(chaiHttp);

// Unit tests for authoriziation
describe('Test (/test) APIs', function () {
	
	// Default test route
	it('Default test route', function (done) {
		this.timeout(15000);
		chai.request(server)
	    .get('/test')
	    .end(function(err, res){
	      res.should.have.status(200);
	      done();
	    });
    });
});