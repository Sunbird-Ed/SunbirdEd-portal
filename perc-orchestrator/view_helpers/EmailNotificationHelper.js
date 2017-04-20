var promise_lib = require('when')
    , awsHelper = require('../interactions/wrappers/ses/sesWrapper')
    , path = require('path')
    , templatesDir = path.resolve(__dirname, '..', 'email_templates')
    , emailTemplates = require('email-templates');


exports.sendInvitationMail = function(user) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function(){
		emailTemplates(templatesDir, function(err, template) {
			if (err) {
		    	console.log(err);
		  	} else {
		    	var locals = {
		      		displayName: user.displayName,
		      		userEmail: user.userEmail,
		      		userPassword: user.userPassword
	    		};
			    // Send a single email
			    template('welcome', locals, function(err, html, text) {
			      	if (err) {
			        	console.log(err);
			      	} else {
			      		console.log("Sending mail to "+user.email);
				        var mailoptions = {
			        		from: 'learner.support@stackroute.in',
			        		to: user.email,
			        		subject: 'Welcome to SunBird!',
			        		html: html
		    			};
		    			awsHelper.sendMail(mailoptions, function(err, data) {
		    				console.log('Send welcome email - ', 'err', err, 'data', data);
		    			});
			      	}
			    });
			}
		});
	})
}