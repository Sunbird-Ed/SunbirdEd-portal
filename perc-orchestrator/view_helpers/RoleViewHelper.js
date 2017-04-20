/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Roles
 *
 * @author Mahesh
 */

var mongoose = require('mongoose');
var errorModule = require('./ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../commons/ViewHelperUtil');
var RBACUtil = require('../commons/RBACUtil');

/**
*	To Save or Create role.
*	@return response.
*/
exports.saveRole =  function(req, res) {
	var errors = [];
	RoleModel = mongoose.model('RoleModel');
	var body = req.body;
	var role = null;
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(RoleModel.findOne, RoleModel, [{identifier: body.identifier}]))
    .then(function(roleModel) {
    	if(roleModel == null) {
    		roleModel = new RoleModel();
    	}
    	
		// Populate model to be saved to MongoDB
		for(var k in body) {
			if (k != "__v" && k != "_id") {
				roleModel[k]=body[k];
			}
		}

		var deferred = promise_lib.defer();
		roleModel.save(function(err, object) {
			if(err) {
				deferred.reject(err);
			} else {
				role = object;
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.then(function() {
		return RBACUtil.getAllRoles();
	})
	.then(function(roles) {
		var approles = {};
        roles.forEach(function(role) {
        	approles[ role.identifier ] = role.actions;
        });
        RBACUtil.setRoles(approles);
	})
    .done(function() {
        if(errors.length > 0) {
            console.log('failed to save role',errors);
        } else {
            res.send(role);
        }
    });
};

/**
*	To delete a role.
*	@return response.
*/

exports.delete =  function(req, res) {
	var errors = [];
	RoleModel = mongoose.model('RoleModel');
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(RoleModel.remove, RoleModel, [{identifier: req.params.id}]))
	.then(function() {
		return RBACUtil.getAllRoles();
	})
	.then(function(roles) {
		var approles = {};
        roles.forEach(function(role) {
        	approles[ role.identifier ] = role.actions;
        });
        RBACUtil.setRoles(approles);
	})
	.catch(function(deleteErrors) {
		errors = deleteErrors;
	}).done(function() {
	    if(errors.length > 0) {
	        console.log('failed to delete role',errors);
	    } else {
	        res.send('OK');
	    }
	});
};	

/**
*	To add action to existing role. Here it will check action exist or not then, add to the role.
*	@return response.
*/

exports.addActionToRole = function(req, res) {
	var errors = [];
	RoleModel = mongoose.model('RoleModel');
	ActionModel = mongoose.model('ActionModel');
	var body = req.body;
	var role = null;

	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		ActionModel.findOne({identifier : body.action}).exec(function(err, action) {
			console.log("Error:"+err+ " Action:"+action);
			if(err || !action) {
				defer.reject('action not found.');
			} else {
				defer.resolve(action);
			}
		});
		return defer.promise;
	})
	.then(function(){
		var defer = promise_lib.defer();
		RoleModel.findOne({identifier : body.role}).exec(function(err, role) {
			if(err || !role) {
				defer.reject('role not found.');
			} else {
				defer.resolve(role);
			}
		});
		return defer.promise;
	})
	.then(function(role) {
		var defer = promise_lib.defer();
		if(role.actions.indexOf(body.action) == -1) {
			role.actions.push(body.action);
			role.markModified('actions');
			role.save(function(err, obj) {
				if(err) {
					console.log('Error while saving role:' + err);
					defer.reject('Adding action to role failed.');
				} else {
					role = obj;
					defer.resolve(obj);
				}
			})
		} else {
			defer.reject('action already exist in this role.');
		}
		return defer.promise;
	})
	.then(function() {
		return RBACUtil.getAllRoles();
	})
	.then(function(roles) {
		var approles = {};
        roles.forEach(function(role) {
        	approles[ role.identifier ] = role.actions;
        });
        RBACUtil.setRoles(approles);
	})
	.catch(function(err) {
		if(err) errors = err;
	})
	.done(function() {
		if(errors.length > 0) {
			console.log('Error add action to role:',errors);
			res.send(errors);
		} else {
			res.send(role);
		}
	});
};

/**
*	To remove a action from existing role.
*	@return response.
*/

exports.removeActionFromRole = function(req, res) {
	var errors = [];
	RoleModel = mongoose.model('RoleModel');
	ActionModel = mongoose.model('ActionModel');
	var body = req.body;
	var role = null;

	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		ActionModel.findOne({identifier : body.action}).exec(function(err, action) {
			console.log("Error:"+err+ " Action:"+action);
			if(err || !action) {
				defer.reject('action not found.');
			} else {
				defer.resolve(action);
			}
		});
		return defer.promise;
	})
	.then(function(){
		var defer = promise_lib.defer();
		RoleModel.findOne({identifier : body.role}).exec(function(err, role) {
			if(err || !role) {
				defer.reject('role not found.');
			} else {
				defer.resolve(role);
			}
		});
		return defer.promise;
	})
	.then(function(role) {
		var defer = promise_lib.defer();
		if(role.actions.indexOf(body.action) == -1) {
			defer.reject("action doesn't exist in this role.");
		} else {
			var index = role.actions.indexOf(body.action);
			role.actions.splice(index, 1);
			role.markModified('actions');
			role.save(function(err, obj) {
				if(err) {
					console.log('Error while saving role:' + err);
					defer.reject('Adding action to role failed.');
				} else {
					role = obj;
					defer.resolve(obj);
				}
			});
		}
		return defer.promise;
	})
	.then(function() {
		return RBACUtil.getAllRoles();
	})
	.then(function(roles) {
		var approles = {};
        roles.forEach(function(role) {
        	approles[ role.identifier ] = role.actions;
        });
        RBACUtil.setRoles(approles);
	})
	.catch(function(err) {
		if(err) errors = err;
	})
	.done(function() {
		if(errors.length > 0) {
			console.log('Error add action to role:',errors);
			res.send(errors);
		} else {
			res.send(role);
		}
	});
};

/**
*	To fetch all roles.
*	@return response.
*/

exports.findAll = function(req, res) {
	var errors = [];
	promise_lib.resolve()
    .then(function(){return RBACUtil.getAllRoles(); })
    .then(function(approles) {
    	var roles = {};
        approles.forEach(function(role) {
            roles[ role.identifier ] = role.actions;
         });
         RBACUtil.setRoles(roles);
    	return approles;
    })
    .catch(function(err) {
    	if(err) errors = err;
    })
    .done(function(approles) {
        if(errors.length > 0) {
        	console.log("Error cacheing roles: "+err);
        	res.send("Update cache failed:"+err);
        } else {
        	res.send(approles);
        }
    });
};

/**
*	To fetch all actions.
*	@return response.
*/

exports.findAllActions = function(req, res) {
	var errors = [];
	promise_lib.resolve()
    .then(function(){
    	var defer = promise_lib.defer();
		ActionModel = mongoose.model('ActionModel');
		ActionModel.find().lean().exec(function(err, actions) {
			console.log("roles: "+ actions.length);
			if (err) {
				defer.reject(err);
			} else {
				defer.resolve(actions);
			}
		});
		return defer.promise;
    })
    .catch(function(err) {
    	if(err) errors = err;
    })
    .done(function(actions) {
        if(errors.length > 0) {
        	console.log("Error cacheing roles: "+err);
        	res.send("Update cache failed:"+err);
        } else {
        	res.send(actions);
        }
    });
};

/**
*	To fetch current logged in user actions.
*	@return response.
*/

exports.getCurrentUserActions = function(req, res) {
	var actions = [];
	if(req.user) {
		var cache = RBACUtil.getRoles();
		req.user.roles.forEach(function(role) {
			var roleActions = cache [ role ];
			actions = actions.concat(roleActions);
		});
	} 
	res.send(actions);
}