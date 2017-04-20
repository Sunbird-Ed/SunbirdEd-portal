/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Interaction related service
 * @author abhinav
 */
var middleware = require('../../commons/MWServiceProvider.js');
var mongoose = require('mongoose');
var nodefn = require('when/node');
var userActions = mongoose.model('UserActionModel');

function callMiddleware(command, data, callback) {
    LoggerUtil.log(LogLevel.DEBUG, {type: 'Request to MW', command: command, data: data});
    return middleware.callServiceStandard('interactionService', command, JSON.stringify(data), callback);
}

var callMW = nodefn.lift(callMiddleware);

exports.startInteraction = function(args) {
    return callMW('PostInteraction', args);
}
exports.getInteraction = function(args) {
    return callMW('GetInteraction', args);
}

exports.getInteractions = function(args) {
    return callMW('GetInteractions', args);
}

exports.searchInteractions = function(args) {
    return callMW('SearchInteractions', args);
}

exports.postComment = function(args) {
    return callMW('PostComment', args);
}

exports.commentOnPost = function(args) {
    return callMW('CommentOnPost', args);
}

exports.applyAction = function(args) {
    return callMW('ApplyAction', args);
}

exports.applyFlag = function(args) {
    return callMW('ApplyFlag', args);
}

exports.follow = function(args) {
    return callMW('FollowInteraction', args);
}

exports.applyTag = function(args) {
    return callMW('ApplyTag', args);
}
exports.saveTokens = function(email, tokens) {
    var args = {
        USER_EMAIL_ID: email,
        TOKENS: {
            accessToken: tokens.access_token,
            emailId: email,
            refreshToken: tokens.refresh_token,
            tokenType: tokens.token_type,
            expiryDate: tokens.expiry_date
        }
    };
    return callMW('SaveTokens', args);
}

exports.getActions = function(args) {
    return callMW('GetActions', args);
}

exports.updateMetaData = function(args) {
    return callMW('UpdateMetadata', args);
}

exports.ratePost = function(args) {
    return callMW('RatePost', args);
}

exports.searchSets = function(args) {
    return callMW('SearchSets', args);
}

exports.getSetInteractions = function(args) {
    return callMW('GetSetInteractions', args);
}

exports.createSet = function(args) {
    return callMW('CreateInteractionSet', args);
}

exports.updateSet = function(args) {
    return callMW('UpdateInteractionSet', args);
}

exports.addInteractionToSet = function(args) {
    return callMW('AddInteractionToSet', args);
}

exports.removeInteractionFromSet = function(args) {
    return callMW('RemoveInteractionFromSet', args);
}

exports.publishCourse = function(args) {
    return callMW('PublishCourse', args);
}

exports.deleteSet = function(args) {
    return callMW('DeleteInteractionSet', args);
}

