const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const accountMergeController = require('../../../../controllers/accountMergeController');
const ROUTES = require('../../../../constants/routesConstants');
const helper = require('../../helpers/generics/genericHelper');


describe(('accountMergeRoutes test cases'), () => {

    describe(('accountMergeRoutes test case #1 => ' + ROUTES.ACCOUNT_MERGE.SESSION_SAVE), () => {
        it('should return UNAUTHORIZED if requst body is not given properly', (done) => {
            const request = helper.constructReqBody({});
            const response = helper.getResponseObject();
            accountMergeController.sessionSave(request, response);
            const _responseData = response._getData();
            expect(response.statusCode).to.equal(401);
            expect(_responseData.responseCode).to.equal('UNAUTHORIZED');
            done();
        });
    });
});
