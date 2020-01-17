const expect  = require('chai').expect;
const latexService = require('../../../../helpers/latexService');
const mock = require('mock-require');
const httpMocks = require('node-mocks-http');


var createGETRequest = function (eq, format) {
    if (format && format != '')
        eq = eq + '.' + format;
    let req = httpMocks.createRequest({
        query: {
          equation: eq
        }
    });
    return req;
};

var createPOSTRequest = function (eq, format) {
    if (format && format != '')
        eq = eq + '.' + format;
    let req = httpMocks.createRequest({
        body: {
          equation: eq
        }
    });
    return req;
};

var createResponse = function () {
    let res = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
    });
    return res;
};

describe('LatexService Test Cases', function () {

it('GET request test', function(done) {
    let req = createGETRequest('\\sin\\theta');
    let res = createResponse();
    latexService.convert(req, res);
    const responseData = res._getData();
    var str2 = responseData.replace(/\n|\r/g, "");
    expect(str2).not.null;
    expect(str2).contains('<svg');
    expect(str2).contains('fill="black"');
    expect(res.statusCode).to.eql(200);
    expect(res.getHeader('Content-Type')).to.eql('image/svg+xml');
    done();
});

it('Post request test', function(done) {
    let req = createPOSTRequest('\\sin\\theta');
    let res = createResponse();
    latexService.convert(req, res);
    const responseData = res._getData();
    var str2 = responseData.replace(/\n|\r/g, "");
    expect(str2).not.null;
    expect(str2).contains('<svg');
    expect(str2).contains('fill="black"');
    expect(res.statusCode).to.eql(200);
    expect(res.getHeader('Content-Type')).to.eql('image/svg+xml');
    done();
});

it('Invalid request test', function(done) {
    let req = createPOSTRequest('');
    let res = createResponse();
    latexService.convert(req, res);
    const responseData = res._getData();
    expect(res.statusCode).to.eql(400);
    expect(responseData).to.eql('Bad Request');
    done();
});

it('Null request test', function(done) {
    let req = createPOSTRequest(null);
    let res = createResponse();
    latexService.convert(req, res);
    const responseData = res._getData();
    expect(res.statusCode).to.eql(400);
    expect(responseData).to.eql('Bad Request');
    done();
});

it('SVG to PNG test', function(done) {
    const equation = '\\sin\\theta';
    const svgString = latexService.tex2svg(equation, "black");
    let pngPromise = latexService.svg2png(svgString);
    pngPromise.then( (result) => {
        expect(result).not.null;
        done();
    });
});

});

