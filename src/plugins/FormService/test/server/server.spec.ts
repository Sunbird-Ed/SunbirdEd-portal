import { TestFramework } from 'ext-framework-server/test-framework';
import { FrameworkConfig } from 'ext-framework-server/interfaces';
import 'mocha';
import * as path from 'path';
import * as sinon from 'sinon';
import { manifest } from 'form-service/manifest';
import * as request from 'supertest';
const plugin = { id: manifest.id, ver: manifest.version };
const baseURL = "http://127.0.0.1:9000"; //default port 9000
const api = request(baseURL);

describe('Form API Integration test cases', () => {

  before((done) => {
    let config: FrameworkConfig = { plugins: [plugin], pluginBasePath: path.join(__dirname, 'node_modules/') }
    TestFramework.initialize(config).then(() => {
      done();
    })
  })

  describe('create API', () => {
    const Endpoint = '/v1/form/create';
    it('should create the form when valid request and send 200', (done) => {

      // valid request 1
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "textbook",
            "action": "save",
            "component": "app",
            "framework": "NCF",
            "rootOrgId": "sunbird",
            "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "be48e992-c5e4-4594-9b7a-dcad63d1c758";
          res.body.params.msgid = "b7af2a21-a0eb-45df-a1e3-fe947a4dd4ae";
          res.body.ts = "2018-07-05T06:16:03.640Z";
        })
        .expect(200, {
          "id": "api.form.create",
          "params": {
            "resmsgid": "be48e992-c5e4-4594-9b7a-dcad63d1c758",
            "msgid": "b7af2a21-a0eb-45df-a1e3-fe947a4dd4ae",
            "status": "successful"
          },
          "responseCode": "OK",
          "result": {
            "created": "OK"
          },
          "ts": "2018-07-05T06:16:03.640Z",
          "ver": "1.0"
        });

      // valid request 2
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "action": "save",
            "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "be48e992-c5e4-4594-9b7a-dcad63d1c758";
          res.body.params.msgid = "b7af2a21-a0eb-45df-a1e3-fe947a4dd4ae";
          res.body.ts = "2018-07-05T06:16:03.640Z";
        })
        .expect(200, {
          "id": "api.form.create",
          "params": {
            "resmsgid": "be48e992-c5e4-4594-9b7a-dcad63d1c758",
            "msgid": "b7af2a21-a0eb-45df-a1e3-fe947a4dd4ae",
            "status": "successful"
          },
          "responseCode": "OK",
          "result": {
            "created": "OK"
          },
          "ts": "2018-07-05T06:16:03.640Z",
          "ver": "1.0"
        })
        .end(done)
    })
    it('should not create when "framework" is defined but not "rootOrgId" and send 400', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "textbook",
            "action": "save",
            "framework": "NCF",
            "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "018ea6b7-d80c-4e83-8904-ed64222f2b85";
          res.body.params.msgid = "7424c79f-f29d-404f-b94e-418d063a2db9";
          res.body.ts = "2018-07-05T07:26:24.959Z";
        })
        .expect(400, {
          "id": "api.form.create",
          "params": {
            "resmsgid": "018ea6b7-d80c-4e83-8904-ed64222f2b85",
            "msgid": "7424c79f-f29d-404f-b94e-418d063a2db9",
            "status": "failed",
            "err": "ERR_CREATE_FORM_DATA",
            "errmsg": "specifiy \"rootOrgId\" along with \"framework\""
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T07:26:24.959Z",
          "ver": "1.0"
        })
        .end(done)
    })
    it('should create when "framework" and "rootOrgId" is not defined and send 200', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "textbook",
            "action": "save",
            "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "be48e992-c5e4-4594-9b7a-dcad63d1c758";
          res.body.params.msgid = "b7af2a21-a0eb-45df-a1e3-fe947a4dd4ae";
          res.body.ts = "2018-07-05T06:16:03.640Z";
        })
        .expect(200, {
          "id": "api.form.create",
          "params": {
            "resmsgid": "be48e992-c5e4-4594-9b7a-dcad63d1c758",
            "msgid": "b7af2a21-a0eb-45df-a1e3-fe947a4dd4ae",
            "status": "successful"
          },
          "responseCode": "OK",
          "result": {
            "created": "OK"
          },
          "ts": "2018-07-05T06:16:03.640Z",
          "ver": "1.0"
        })
        .end(done)
    })

    it('should not create when "type" and "action" is not defined and send 400', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            // "type": "content",
            "subType": "textbook",
            // "action": "save",
            "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "018ea6b7-d80c-4e83-8904-ed64222f2b85";
          res.body.params.msgid = "7424c79f-f29d-404f-b94e-418d063a2db9";
          res.body.ts = "2018-07-05T07:26:24.959Z";
        })
        .expect(400, {
          "id": "api.form.create",
          "params": {
            "resmsgid": "018ea6b7-d80c-4e83-8904-ed64222f2b85",
            "msgid": "7424c79f-f29d-404f-b94e-418d063a2db9",
            "status": "failed",
            "err": "ERR_CREATE_FORM_DATA",
            "errmsg": [
              "\"type\" is required",
              "\"action\" is required"
            ],
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T07:26:24.959Z",
          "ver": "1.0"
        })
        .end(done)
    })
    it('should not create when "data" is not defined and send 400', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "textbook",
            "action": "save"
            // "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "018ea6b7-d80c-4e83-8904-ed64222f2b85";
          res.body.params.msgid = "7424c79f-f29d-404f-b94e-418d063a2db9";
          res.body.ts = "2018-07-05T07:26:24.959Z";
        })
        .expect(400, {
          "id": "api.form.create",
          "params": {
            "resmsgid": "018ea6b7-d80c-4e83-8904-ed64222f2b85",
            "msgid": "7424c79f-f29d-404f-b94e-418d063a2db9",
            "status": "failed",
            "err": "ERR_CREATE_FORM_DATA",
            "errmsg": [
              "\"data\" is required"
            ],
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T07:26:24.959Z",
          "ver": "1.0"
        })
        .end(done)
    })
    it('should not create when "framework" is given but not "rootOrgId" in the request and send 400', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "textbook",
            "action": "save",
            "framework": "NCF",
            "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "018ea6b7-d80c-4e83-8904-ed64222f2b85";
          res.body.params.msgid = "7424c79f-f29d-404f-b94e-418d063a2db9";
          res.body.ts = "2018-07-05T07:26:24.959Z";
        })
        .expect(400, {
          "id": "api.form.create",
          "params": {
            "resmsgid": "018ea6b7-d80c-4e83-8904-ed64222f2b85",
            "msgid": "7424c79f-f29d-404f-b94e-418d063a2db9",
            "status": "failed",
            "err": "ERR_CREATE_FORM_DATA",
            "errmsg": "specifiy \"rootOrgId\" along with \"framework\"",
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T07:26:24.959Z",
          "ver": "1.0"
        })
        .end(done)
    })
  });

  describe('Update API', () => {
    const Endpoint = '/v1/form/update';
    it('should update the form (if exist) for valid request and send 200', (done) => {
      // create default form with "framework": "sunbird" and "rootOrgId": "9876541234" 
      api.post('/v1/form/create')
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "action": "search",
            "framework": "sunbird",
            "rootOrgId": "9876541234",
            "data": { "template": "template1" }
          }
        }).then(() => {
          // test the default form is updated
          api.post(Endpoint)
            .set('Content-Type', 'application/json')
            .send({
              "request": {
                "type": "content",
                "action": "search",
                "framework": "sunbird",
                "rootOrgId": "9876541234",
                "data": { "template": "this is updated template" }
              }
            })
            .expect((res) => {
              res.body.params.resmsgid = "4bc48c51-5246-45d1-9648-5e8f721011f0";
              res.body.params.msgid = "d31f514e-f92a-4f0d-bf7e-8081e3b4ab38";
              res.body.ts = "2018-07-05T09:19:48.976Z";
            })
            .expect(200, {
              "id": "api.form.update",
              "params": {
                "resmsgid": "4bc48c51-5246-45d1-9648-5e8f721011f0",
                "msgid": "d31f514e-f92a-4f0d-bf7e-8081e3b4ab38",
                "status": "successful"
              },
              "responseCode": "OK",
              "result": {
                "response": [
                  {
                    "rootOrgId": "9876541234",
                    "key": "content.*.search.*",
                    "status": "SUCCESS"
                  }
                ]
              },
              "ts": "2018-07-05T09:19:48.976Z",
              "ver": "1.0"
            })
            .end(done);
        })


    });

    it('should update the default form (if exist) when "framework" and "rootOrgId" is not defined and send 200', (done) => {
      // create default form with "framework": "*" and "rootOrgId": "*" (default values if not given)
      api.post('/v1/form/create')
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "textbook",
            "action": "save",
            "data": { "template": "template1" }
          }
        }).then(() => {
          // test the default form is updated
          api.post(Endpoint)
            .set('Content-Type', 'application/json')
            .send({
              "request": {
                "type": "content",
                "subType": "textbook",
                "action": "save",
                "data": { "template": "template1" }
              }
            })
            .expect((res) => {
              res.body.params.resmsgid = "4bc48c51-5246-45d1-9648-5e8f721011f0";
              res.body.params.msgid = "d31f514e-f92a-4f0d-bf7e-8081e3b4ab38";
              res.body.ts = "2018-07-05T09:19:48.976Z";
            })
            .expect(200, {
              "id": "api.form.update",
              "params": {
                "resmsgid": "4bc48c51-5246-45d1-9648-5e8f721011f0",
                "msgid": "d31f514e-f92a-4f0d-bf7e-8081e3b4ab38",
                "status": "successful"
              },
              "responseCode": "OK",
              "result": {
                "response": [
                  {
                    "rootOrgId": "*",
                    "key": "content.textbook.save.*",
                    "status": "SUCCESS"
                  }
                ]
              },
              "ts": "2018-07-05T09:19:48.976Z",
              "ver": "1.0"
            })
            .end(done);
        });
    });
    it('should not update the default form (if not exist) when "framework" and "rootOrgId" is not defined and send 400', (done) => {

      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {// below record doesn't exist in the system
            "type": "test1",
            "subType": "api-test",
            "action": "test",
            "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "da6585f5-477c-4b77-b5f9-112122dd1604";
          res.body.params.msgid = "f0144ed1-4a1c-4c3b-ab71-ca2262dae487";
          res.body.ts = "2018-07-05T09:27:28.832Z";
        })
        .expect(400, {
          "id": "api.form.update",
          "params": {
            "resmsgid": "da6585f5-477c-4b77-b5f9-112122dd1604",
            "msgid": "f0144ed1-4a1c-4c3b-ab71-ca2262dae487",
            "status": "failed",
            "err": "ERR_UPDATE_FORM_DATA",
            "errmsg": "invalid request, no records found for the match to update!"
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T09:27:28.832Z",
          "ver": "1.0"
        })
        .end(done);
    });
    it('should not update when "data" is not defined and send 400', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "textbook",
            "action": "save"
            // "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "da6585f5-477c-4b77-b5f9-112122dd1604";
          res.body.params.msgid = "f0144ed1-4a1c-4c3b-ab71-ca2262dae487";
          res.body.ts = "2018-07-05T09:27:28.832Z";
        })
        .expect(400, {
          "id": "api.form.update",
          "params": {
            "resmsgid": "da6585f5-477c-4b77-b5f9-112122dd1604",
            "msgid": "f0144ed1-4a1c-4c3b-ab71-ca2262dae487",
            "status": "failed",
            "err": "ERR_UPDATE_FORM_DATA",
            "errmsg": ["\"data\" is required"]
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T09:27:28.832Z",
          "ver": "1.0"
        })
        .end(done);
    });
    it('should not update when the given form doesn\'t exist', (done) => {

      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {// below record doesn't exist in the system
            "type": "test1",
            "subType": "api-test",
            "action": "test",
            "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "da6585f5-477c-4b77-b5f9-112122dd1604";
          res.body.params.msgid = "f0144ed1-4a1c-4c3b-ab71-ca2262dae487";
          res.body.ts = "2018-07-05T09:27:28.832Z";
        })
        .expect(400, {
          "id": "api.form.update",
          "params": {
            "resmsgid": "da6585f5-477c-4b77-b5f9-112122dd1604",
            "msgid": "f0144ed1-4a1c-4c3b-ab71-ca2262dae487",
            "status": "failed",
            "err": "ERR_UPDATE_FORM_DATA",
            "errmsg": "invalid request, no records found for the match to update!"
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T09:27:28.832Z",
          "ver": "1.0"
        })
        .end(done);
    })
    it('should not update when "type" and "action" is not defined and send 400', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            // "type": "content",
            "subType": "textbook",
            // "action": "save",
            "framework": "sunbird",
            "rootOrgId": "12345",
            "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "da6585f5-477c-4b77-b5f9-112122dd1604";
          res.body.params.msgid = "f0144ed1-4a1c-4c3b-ab71-ca2262dae487";
          res.body.ts = "2018-07-05T09:27:28.832Z";
        })
        .expect(400, {
          "id": "api.form.update",
          "params": {
            "resmsgid": "da6585f5-477c-4b77-b5f9-112122dd1604",
            "msgid": "f0144ed1-4a1c-4c3b-ab71-ca2262dae487",
            "status": "failed",
            "err": "ERR_UPDATE_FORM_DATA",
            "errmsg": [
              "\"type\" is required",
              "\"action\" is required"
            ]
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T09:27:28.832Z",
          "ver": "1.0"
        })
        .end(done);
    });
    it('should not update when "framework" is given but not "rootOrgId" in the request and send 400', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "textbook",
            "action": "save",
            "framework": "NCF",
            "data": { "template": "template1" }
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "bee50e1a-67f1-4bc8-a7a7-d2ddcb90c6cf";
          res.body.params.msgid = "decb96ef-cb5c-4d24-ba98-97bd2c5877db";
          res.body.ts = "2018-07-05T10:07:29.694Z";
        })
        .expect(400, {
          "id": "api.form.update",
          "params": {
            "resmsgid": "bee50e1a-67f1-4bc8-a7a7-d2ddcb90c6cf",
            "msgid": "decb96ef-cb5c-4d24-ba98-97bd2c5877db",
            "status": "failed",
            "err": "ERR_UPDATE_FORM_DATA",
            "errmsg": "specifiy \"rootOrgId\" along with \"framework\""
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T10:07:29.694Z",
          "ver": "1.0"
        })
        .end(done);
    })
  });

  describe('Read API', () => {
    const Endpoint = '/v1/form/read';
    it('should get the form (if exist) for valid request and send 200', (done) => {
      // create the form to read the data
      api.post('/v1/form/create')
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "action": "search",
            "framework": "sunbird",
            "rootOrgId": "9876541234",
            "data": { "template": "template1" }
          }
        }).then(() => {
          // read the form
          api.post(Endpoint)
            .set('Content-Type', 'application/json')
            .send({
              "request": {
                "type": "content",
                "action": "search",
                "framework": "sunbird",
                "rootOrgId": "9876541234"
              }
            })
            .expect((res) => {
              res.body.params.resmsgid = "f573155d-4d6c-4e75-822d-8c15525376ce";
              res.body.params.msgid = "2b7ff1ae-dcf3-4e7c-b278-e9920afea9f4";
              res.body.ts = "2018-07-05T10:13:59.485Z";
            })
            .expect(200, {
              "id": "api.form.read",
              "params": {
                "resmsgid": "f573155d-4d6c-4e75-822d-8c15525376ce",
                "msgid": "2b7ff1ae-dcf3-4e7c-b278-e9920afea9f4",
                "status": "successful"
              },
              "responseCode": "OK",
              "result": {
                "form": {
                  "type": "content",
                  "subType": "*",
                  "action": "search",
                  "component": "*",
                  "rootOrgId": "9876541234",
                  "framework": "sunbird",
                  "data": {
                    "template": "template1"
                  }
                }
              },
              "ts": "2018-07-05T10:13:59.485Z",
              "ver": "1.0"
            })
            .end(done);
        })
    })
    it('should success (if no record found) for valid request and send 200', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": { // below form doesn't exist
            "type": "some-valid-type",
            "action": "some-valid-action",
            "framework": "sunbird",
            "rootOrgId": "9876541234"
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "f573155d-4d6c-4e75-822d-8c15525376ce";
          res.body.params.msgid = "2b7ff1ae-dcf3-4e7c-b278-e9920afea9f4";
          res.body.ts = "2018-07-05T10:13:59.485Z";
        })
        .expect(200, {
          "id": "api.form.read",
          "params": {
            "resmsgid": "f573155d-4d6c-4e75-822d-8c15525376ce",
            "msgid": "2b7ff1ae-dcf3-4e7c-b278-e9920afea9f4",
            "status": "successful"
          },
          "responseCode": "OK",
          "result": {
            "form": {}
          },
          "ts": "2018-07-05T10:13:59.485Z",
          "ver": "1.0"
        })
        .end(done);
    })
    it('should get default form (if exist) when "framework" and "rootOrgId" is not defined and send 200', (done) => {
      // create the default form
      api.post('/v1/form/create')
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "ecml",
            "action": "search",
            "data": { "template": "this is default template" }
          }
        }).then(() => {
          api.post(Endpoint)
            .set('Content-Type', 'application/json')
            .send({
              "request": {
                "type": "content",
                "subType": "ecml",
                "action": "search",
                "framework": "sunbird",
                "rootOrgId": "9876541234"
              }
            })
            .expect((res) => {
              res.body.params.resmsgid = "f573155d-4d6c-4e75-822d-8c15525376ce";
              res.body.params.msgid = "2b7ff1ae-dcf3-4e7c-b278-e9920afea9f4";
              res.body.ts = "2018-07-05T10:13:59.485Z";
            })
            .expect(200, {
              "id": "api.form.read",
              "params": {
                "resmsgid": "f573155d-4d6c-4e75-822d-8c15525376ce",
                "msgid": "2b7ff1ae-dcf3-4e7c-b278-e9920afea9f4",
                "status": "successful"
              },
              "responseCode": "OK",
              "result": {
                "form": {
                  "type": "content",
                  "subType": "ecml",
                  "action": "search",
                  "component": "*",
                  "rootOrgId": "*",
                  "framework": "*",
                  "data": {
                    "template": "this is default template"
                  }
                }
              },
              "ts": "2018-07-05T10:13:59.485Z",
              "ver": "1.0"
            })
            .end(done);
        })
    })
    it('should success when default form doesn\'t exist for "rootOrgId" and send 200', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "collection",
            "action": "search",
            "rootOrgId": "572394871"
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "f573155d-4d6c-4e75-822d-8c15525376ce";
          res.body.params.msgid = "2b7ff1ae-dcf3-4e7c-b278-e9920afea9f4";
          res.body.ts = "2018-07-05T10:13:59.485Z";
        })
        .expect(200, {
          "id": "api.form.read",
          "params": {
            "resmsgid": "f573155d-4d6c-4e75-822d-8c15525376ce",
            "msgid": "2b7ff1ae-dcf3-4e7c-b278-e9920afea9f4",
            "status": "successful"
          },
          "responseCode": "OK",
          "result": {
            "form": {}
          },
          "ts": "2018-07-05T10:13:59.485Z",
          "ver": "1.0"
        })
        .end(done);
    })
    it('should read default form when "rootOrgId" is given and "framework" is undefined and send 200', (done) => {

      api.post('/v1/form/create')
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "subType": "ecml",
            "action": "search",
            "rootOrgId": "324579120213",
            "data": { "template": "this is default template" }
          }
        }).then(() => {
          api.post(Endpoint)
            .set('Content-Type', 'application/json')
            .send({
              "request": {
                "type": "content",
                "subType": "ecml",
                "action": "search",
                "rootOrgId": "324579120213"
              }
            })
            .expect((res) => {
              res.body.params.resmsgid = "f573155d-4d6c-4e75-822d-8c15525376ce";
              res.body.params.msgid = "2b7ff1ae-dcf3-4e7c-b278-e9920afea9f4";
              res.body.ts = "2018-07-05T10:13:59.485Z";
            })
            .expect(200, {
              "id": "api.form.read",
              "params": {
                "resmsgid": "f573155d-4d6c-4e75-822d-8c15525376ce",
                "msgid": "2b7ff1ae-dcf3-4e7c-b278-e9920afea9f4",
                "status": "successful"
              },
              "responseCode": "OK",
              "result": {
                "form": {
                  "type": "content",
                  "subType": "ecml",
                  "action": "search",
                  "component": "*",
                  "rootOrgId": "324579120213",
                  "framework": "*",
                  "data": {
                    "template": "this is default template"
                  }
                }
              },
              "ts": "2018-07-05T10:13:59.485Z",
              "ver": "1.0"
            })
            .end(done);
        });
    })
    it('should fail when "type" and "action" is not given in the request and send 400', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "framework": "sunbird",
            "rootOrgId": "9876541234"
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "6681bd33-2ea3-4f64-8be8-7f61539a117e";
          res.body.params.msgid = "e69c11ea-6949-435f-a8d5-ac33e4d0859b";
          res.body.ts = "2018-07-05T10:38:04.437Z";
        })
        .expect(400, {
          "id": "api.form.read",
          "params": {
            "resmsgid": "6681bd33-2ea3-4f64-8be8-7f61539a117e",
            "msgid": "e69c11ea-6949-435f-a8d5-ac33e4d0859b",
            "status": "failed",
            "err": "ERR_READ_FORM_DATA",
            "errmsg": [
              "\"type\" is required",
              "\"action\" is required"
            ]
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T10:38:04.437Z",
          "ver": "1.0"
        })
        .end(done);
    })
    it('should fail when "framework" is given but not "rootOrgId" in the request and send 400', (done) => {
      api.post(Endpoint)
        .set('Content-Type', 'application/json')
        .send({
          "request": {
            "type": "content",
            "action": "search",
            "framework": "sunbird"
          }
        })
        .expect((res) => {
          res.body.params.resmsgid = "6681bd33-2ea3-4f64-8be8-7f61539a117e";
          res.body.params.msgid = "e69c11ea-6949-435f-a8d5-ac33e4d0859b";
          res.body.ts = "2018-07-05T10:38:04.437Z";
        })
        .expect(400, {
          "id": "api.form.read",
          "params": {
            "resmsgid": "6681bd33-2ea3-4f64-8be8-7f61539a117e",
            "msgid": "e69c11ea-6949-435f-a8d5-ac33e4d0859b",
            "status": "failed",
            "err": "ERR_READ_FORM_DATA",
            "errmsg": "specifiy \"rootOrgId\" along with \"framework\""
          },
          "responseCode": "CLIENT_ERROR",
          "result": {},
          "ts": "2018-07-05T10:38:04.437Z",
          "ver": "1.0"
        })
        .end(done);
    })
  });
});