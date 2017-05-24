//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../api/app.js');
let should = chai.should();
var config = require('config');
var fs = require('fs');

chai.use(chaiHttp);
//Our parent block
describe('API', () => {
    before((done) => { //Before each test we empty the database
        if(fs.existsSync(config.db_path)){
            fs.unlinkSync(config.db_path);
        }
        return done();
    });
    
    /*
    * Test the /GET api/url before filling it
    */
    describe('/GET api/url', () => {
      it('should return 404', (done) => {
        chai.request(server)
            .get('/api/url')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.deep.property('message');
                //
                done();
            });
      });
    });
    
    
    /*
    * Test the /PUT api/url filling and getting
    */
    describe('/PUT api/url', () => {
      it('should return 200', (done) => {
        chai.request(server)
            .put('/api/url')
            .send({ url: 'https://demo6651367.mockable.io' })
            .end((err, res) => {
                console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.deep.property('url');
                //
                done();
            });
      });
    });
    
    describe('/GET api/url', () => {
      it('should return 200', (done) => {
        chai.request(server)
            .get('/api/url')
            .end((err, res) => {
                console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.deep.property('url');
                //
                done();
            });
      });
    });
    
    /*
    * Test the /GET api/providers before filling it
    */
    describe('/GET api/providers', () => {
      it('should return 200', (done) => {
        chai.request(server)
            .get('/api/providers')
            .end((err, res) => {
                console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.deep.property('docker.backends.backend-portainer.servers.server-portainer.url');
                //
                done();
            });
      });
    });

});
return;