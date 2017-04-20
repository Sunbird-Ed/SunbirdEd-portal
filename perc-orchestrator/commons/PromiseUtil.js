var promise_lib = require('when');

PromiseHelper = function(options) {
	var promises = [];
	var opts = options || {parallel: false, context: {}};
	add = function(fn) {
		promises.add(promise_lib(fn));
	};
	execute = function(callback) {
		if(opts.parallel) {

		} else {
			promise_lib.resolve()
		}
	}
}

exports.promiseHelper = function() {

}