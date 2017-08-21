var chai = require( 'chai' );
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

// Unit tests for sample API
describe('Test (/sample) APIs', function () {
	
	// Default test route
	it('Default test route', function (done) {
		this.timeout(15000);
		chai.request(server)
	    .get('/sample')
	    .end(function(err, res){
	      res.should.have.status(200);
	      done();
	    });
    });
});