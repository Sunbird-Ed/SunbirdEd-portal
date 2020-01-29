const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const mock = require('mock-require');

const accountMergeController = require('../../../../controllers/accountMergeController');
const ROUTES = require('../../../../constants/routesConstants');
const helper = require('../../helpers/generics/genericHelper');
const mockData = require('../testData/accountMergeRouteTestData.json');
const accountMergeHelper = require('../../../../helpers/accountMergeHelper')

const mockFunction = function() {}

const mockAccountMergeHelper = {
    initiateAccountMerge: function (data) {
      new Promise((resolve, reject) => {
        if (data) {
            resolve(data)
        } else {
            resolve();
        }
      })
    },
    initiateAccountMerge: mockFunction,
  };


describe(('accountMergeRoutes test cases'), () => {

    describe(('accountMergeRoutes test case #1 => ' + ROUTES.ACCOUNT_MERGE.SESSION_SAVE), () => {
        it('should return UNAUTHORIZED if request body is not given', (done) => {
            const request = helper.constructReqBody({});
            const response = helper.getResponseObject();
            accountMergeController.sessionSave(request, response);
            const _responseData = response._getData();
            expect(response.statusCode).to.equal(401);
            expect(_responseData.responseCode).to.equal('UNAUTHORIZED');
            done();
        });

        it('should return Error response  if request body is not given properly', (done) => {
            const request = helper.constructReqBody({
                session: {
                    userId: '',
                    save: function (next) {
                        next({
                            mockResp: 'mockResponse'
                        });
                    },
                },
                kauth: {
                    grant: {
                        access_token: {
                            token: mockData.token
                        }
                    }
                },
                query: {
                    redirectUri: 'https://fakeUri.net.in/auth'
                }
            });
            const response = helper.getResponseObject();
            accountMergeController.sessionSave(request, response);
            const _responseData = response._getData();
            expect(response.statusCode).to.equal(500);
            expect(_responseData.responseCode).to.equal('INTERNAL_SERVER_ERROR');
            done();
        });

        it('should return Success response  if request body is given properly', (done) => {
            const request = helper.constructReqBody({
                session: {
                    userId: '87cb1e5b-16cf-4160-9a2c-7384da0a78df',
                    save: function (next) {
                        next();
                    }
                },
                kauth: {
                    grant: { 
                        access_token: {
                            token: mockData.token
                        }
                    }
                },
                query: {
                    redirectUri: 'https://fakeUri.net.in/auth'
                }
            });
            debugger
            const response = helper.getResponseObject();
            accountMergeController.sessionSave(request, response);
            const _responseData = response._getData();
            expect(response.statusCode).to.equal(200);
            expect(_responseData.responseCode).to.equal('OK')
            done();
        });
    });

    
});
