let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../../app/server.js')
let sinon = require('sinon')
let notificationCtrl = require('../../app/helpers/notifications/controller.js')
const Response = require('../../app/helpers/notifications/responseHelper.js')
const expect = chai.expect
chai.use(chaiHttp)
const HOST = 'http://localhost:3000/api/notifications'

describe('Notifications routing service', function() {
    describe('/pull API', function() {
        it('Should invoke pull api', function(done) {
            let validReq = {"request": {"userId": "123", "limit": "10", "filters": {"since": "fsd", "till": "fd", "from": "zxczxc"} } }
            var controllerSpy = sinon.spy(notificationCtrl, 'pull')
            chai.request(HOST)
                .post('/pull')
                .send(validReq)
                .end(function(err, res) {
                    expect(res.body.responseCode).to.equal('OK');
                    done();
                });
        });
        it('When invalid request object', function(done) {
            let validReq = {"request": {"userId": 123, "limit": "10", "filters": {"since": "fsd", "till": "fd", "from": "zxczxc"} } }
            chai.request(HOST)
                .post('/pull')
                .send(validReq)
                .end(function(err, res) {
                    expect(res.body.responseCode).to.equal('ERROR');
                    done();
                });
        });
    })

    describe('/create API',function(){
        it('Should invoke create api',function(done){
          let validReq = {"request": {"title": "Notification titile", "description": "Notification descripton", "createdDate": "DD/MM/YYYY", "priority": "High", "language": "English", "sender": {"id": "sender_1", "name": "sender_name", "type":"org"}, "recevier": [{"id":"fd"}], "origin": {"entity": "announcement", "id": "announcement_1"} } }
          var controllerSpy = sinon.spy(notificationCtrl, 'create')
            chai.request(HOST)
                .post('/create')
                .send(validReq)
                .end(function(err, res){
                    expect(res.body.responseCode).to.equal('OK');
                    expect(res.body.result).to.not.be.empty; 
                    done();
                });
        });

        it('When invalid request',function(done){
          let request = {};
          chai.request(HOST)
              .post('/create')
              .send(request)
              .end(function(err, res){
                  expect(res.body.responseCode).to.equal('ERROR');
                  expect(res.body.result).to.be.empty; 
                  done();
              });
        });

    });

})