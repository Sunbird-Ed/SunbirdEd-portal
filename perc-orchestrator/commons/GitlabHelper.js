
var Client = require('node-rest-client').Client;
var client = new Client();

var gitlab = require('gitlab')({
  	url: appConfig.GITLAB_URL,
  	token: appConfig.GITLAB_TOKEN
});

exports.getAllUsers = function(callback) {
	gitlab.users.all(callback);
}

exports.getUser = function(userName, callback) {
	gitlab.users.all({search: userName}, function(users) {
		if(users && users.length > 0) {
			callback(users[0]);
		} else {
			callback(null);
		}
	});
}

exports.createUserIfNotExists = function(email, password, username, name, callback) {
	exports.createUser(email, password, username, name, callback);
}

exports.createUser = function(email, password, username, name, callback) {
	var options = {
		email: email,
		password: "ilimi123", // MG - the password is hardcoded because, PE alway expect password as this.
		username: username,
		name: name,
		projects_limit: appConfig.GITLAB_PROJECTS_LIMIT
		//extern_uid: username
	}
	try {
		gitlab.users.create(options, callback);
	} catch(err) {
		console.log('GitlabHelper.createUser(). Error - ' + err);
		callback(null);
	}
}

exports.deleteUser = function(userId, callback) {
	var url = appConfig.GITLAB_URL + '/api/v3/users/' + userId;
	args = {
		headers: {
			"PRIVATE-TOKEN": appConfig.GITLAB_TOKEN
		}
    };
	client.delete(url, args, function(data, response) {
        callback(null, data);
    }).on('error', function(err) {
        callback(err);
    });
}

/*exports.deleteUser('5', function(err, data) {
    console.log('Response from deleteUser',err, data);
});*/


/*exports.createUser('santhoshv@app.ilimi.in', 'ilimi123', 'santhoshv', 'Santhosh V', function(data) {
    console.log(data);
});*/

/*exports.getUser('student1', function(user) {
	console.log('user', user);
});*/