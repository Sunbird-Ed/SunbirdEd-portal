'use strict';

describe('Filter: arrayToString', function() {

    // load the filter's module
    beforeEach(module('playerApp'));

    // initialize a new instance of the filter before each test
    var arrayToString;
    beforeEach(inject(function($filter) {
        arrayToString = $filter('arrayToString');
    }));

    it('should return the input prefixed with "arrayToString filter:"', function() {
        var text = 'angularjs';
        expect(arrayToString(text)).toBe('a' + text);
    });

});