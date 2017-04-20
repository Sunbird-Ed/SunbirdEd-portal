/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * AWS SES wrapper
 * @author abhinav
 */

var mailer = require('nodemailer');
var sesTrans = require('nodemailer-ses-transport');
var fs = require('fs');
var AWS = require('aws-sdk');

var ses = new AWS.SES({
    accessKeyId: appConfig.AWS_ACCESSKEYID,
    secretAccessKey: appConfig.AWS_SECRETACCESSKEY,
    region: appConfig.AWS_REGION,
    maxRetries: 10,
    sslEnabled: true
});

var transport = mailer.createTransport(sesTrans({
    accessKeyId: appConfig.AWS_ACCESSKEYID,
    secretAccessKey: appConfig.AWS_SECRETACCESSKEY,
    region: appConfig.AWS_REGION,
    rateLimit: 5
}));

var supportTransport = mailer.createTransport(sesTrans({
    accessKeyId: appConfig.AWS_ACCESSKEYID,
    secretAccessKey: appConfig.AWS_SECRETACCESSKEY,
    region: appConfig.AWS_REGION,
    rateLimit: 5
}));

var mailtrapTransport = mailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 465,
    auth: {
        user: "4e010e83297880",
        pass: "1671449a1e1ca0"
    }
});

/**
* Send a mail
* mailoptions = {
        from: String, // sender address
        to: args.targetEmail, // list of receivers
        subject: args.interactionTitle, // Subject line
        text:  JSON.stringify(body), // plaintext body
        inReplyTo : (args.sesMessageId) ? args.sesMessageId : ''
    }
*/

exports.sendMail = function(mailoptions, callback) {
    if (appConfig.USE_TEST_MAIL == true) {
        console.log("Using mailtrap.io to send Email.");
        return mailtrapTransport.sendMail(mailoptions, callback);
    } else {
        return transport.sendMail(mailoptions, callback);
    }
}

exports.sendSupportMail = function(subject, fileName, text) {
    if(!appConfig.SEND_SUPPORT_MAIL) {
        return;
    }
    console.log('Sending support mail...');
    var mailoptions = {
        from: appConfig.SUPPORT_MAIL_TO, // sender address
        to: appConfig.SUPPORT_MAIL_TO, // list of receivers
        subject: subject + ' in ' + appConfig.APP_ENVIRONMENT, // Subject line
        html: text
    };
    if (fileName) {
        mailoptions.attachments = [{
            filename: fileName,
            path: 'logs/import/' + fileName
        }]
    }
    var mailCallback = function(err, data) {
        if(err) {
            console.log('SesWrapper:sendSupportMail - Error ', err);
        } else {
            console.log('SesWrapper:sendSupportMail - data ', data);
        }
    }
    if (appConfig.USE_TEST_MAIL == true) {
        console.log("Using mailtrap.io to send Email.");
        mailtrapTransport.sendMail(mailoptions, mailCallback);
    } else {
        supportTransport.sendMail(mailoptions, mailCallback);
    }
}

/**
 * Send a course interaction message
 * args     {
                senderEmail : String,
                courseEmail : String,
                metadata : object,
                payload : object
            }
    return  boolean

 */
exports.sendCourseMessage = function(args, callback) {
    var body = {
        payload: args.payload,
        title: args.title,
        metadata: args.metadata
    };

    var mailoptions = {
        from: args.senderEmail, // sender address
        to: args.targetEmail, // list of receivers
        subject: args.interactionTitle, // Subject line
        text: JSON.stringify(body), // plaintext body
        inReplyTo: (args.sesMessageId) ? args.sesMessageId : ''
    };

    return transport.sendMail(mailoptions, callback);

    /*    ses.sendEmail({
            Source: args.senderEmail,
            Destination: {
                ToAddresses: [args.targetEmail]
            },
            Message: {
                Body: {
                    Text: {
                        Data: JSON.stringify(body)
                    }
                },
                Subject: {
                    Data: args.interactionTitle
                }
            }
        }, callback); */
}

/**
 * Send a tutor interaction message
 * args     {
                studentId : String, 
                tutorId : String, 
                metadata : object, 
                payload : object
            }
    return  boolean

 */
exports.sendTutorMessage = function(args) {
    var body = {
        payload: args.payload,
        metadata: args.metadata
    };
    ses.sendEmail({
        Source: utils.generateStudentEmail(args.studentId, config.messagingConfig),
        Destination: {
            ToAddresses: [utils.generateTutorEmail(args.courseId, config.messagingConfig)]
        },
        Message: {
            Body: {
                Text: {
                    Data: JSON.stringify(body)
                }
            }
        }
    }, function(err, data) {
        //if(err) console.log(err, err.stack);
        //else  console.log(data);
    });
}
