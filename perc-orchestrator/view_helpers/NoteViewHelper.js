/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Note
 *
 * @author ravitejagarlapati
 */

var mongoose = require('mongoose');
var errorModule = require('./ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../commons/ViewHelperUtil');
var user = require('./UserViewHelper');
var PlayerUtil = require('./player/PlayerUtil');
var Evernote = require('evernote').Evernote;
//var enml = require('enml-js');
var XMLWriter = require('enml-js/lib/xml-writer');
var SaxParser = require('enml-js/lib/xml-parser').SaxParser;


/**********************************************************************************************************************/

var config = require('./config.json');
//var auth_callbackUrl = "http://localhost:3000/private/v1/everNote/oauth_callback?callback=auth";
//var revoke_callbackUrl = "http://localhost:3000/private/v1/everNote/oauth_callback?callback=revoke";

//var auth_callbackUrl = "http://localhost:3000/private/v1/everNote/oauth_callback";


// OAuth
exports.oauth = function(req, res) {
    var errors = [];
    var client = new Evernote.Client({
        consumerKey: config.API_CONSUMER_KEY,
        consumerSecret: config.API_CONSUMER_SECRET,
        sandbox: config.SANDBOX
    });
    var callbackURL = generateURL(req, req.query.enote);
    console.log("callbackurl", callbackURL);
    client.getRequestToken(callbackURL, function(error, oauthToken, oauthTokenSecret, results) {
        if (error) {
            req.session.error = JSON.stringify(error);
            //res.redirect('/');
        } else {
            // store the tokens in the session
            req.session.oauthToken = oauthToken;
            req.session.oauthTokenSecret = oauthTokenSecret;
            var url = client.getAuthorizeUrl(oauthToken);
            res.redirect(url);
        }
    });
};


exports.oauth_callback = function(req, res) {
    var errors = [];
    var user = req.user;
    var notebookGuid = '';
    console.log("notebookGuid", notebookGuid);
    var client = new Evernote.Client({
        consumerKey: config.API_CONSUMER_KEY,
        consumerSecret: config.API_CONSUMER_SECRET,
        sandbox: config.SANDBOX
    });
    var courseId = req.session.courseId;
    client.getAccessToken(req.session.oauthToken, req.session.oauthTokenSecret, req.param('oauth_verifier'),
        function(error, oauthAccessToken, oauthAccessTokenSecret, results) {

            if (error) {
                /* Evernote returns 401 error for decline and revoke */
                if (error.statusCode == 401) {
                    /* Handling Decline case */
                    if (req.query.callback == "auth") {
                        console.log("User declined Authorisation");
                        //		ViewHelperUtil.addToErrors(errors, error);
                        res.redirect('/private/player/course/' + encodeURIComponent(courseId) + '#/notes');
                    } else {
                        /* Revoke */
                        console.log("REVOKING AUTHORISATION");
                        promise_lib.resolve()
                            .then(function() {
                                //console.log("INSIDE REVOKE");
                                return updateUserAndPromisify(user, false, "", "", notebookGuid, "");
                            })
                            .then(function(updatedUser) {
                                req.session.passport.user = JSON.stringify(updatedUser);
                            })
                            .catch(function(error) {
                                console.log("error in catch", error);
                                ViewHelperUtil.addToErrors(errors, error);
                            })
                            .done(function() {
                                res.redirect('/private/player/course/' + encodeURIComponent(courseId) + '#/notes');
                            })
                    }
                } else {
                    /* log any other errors */
                    ViewHelperUtil.addToErrors(errors, error);
                    res.redirect('/private/player/course/' + encodeURIComponent(courseId) + '#/notes');
                }
            } else {
                console.log("auth or reauth");
                promise_lib.resolve()
                /* Create notebook in User's account */
                .then(function() {
                    var deferred = promise_lib.defer();
                    var noteStore = client.getNoteStore();
                    noteStore.listNotebooks(oauthAccessToken, function(err, noteBookList) {
                        if (err) {
                            console.log("failed to get List:", err);
                            deferred.resolve(err);
                        } else {
                            //console.log("Notebook List", noteBookList);
                            noteBookList.forEach(function(noteBook) {
                                if (noteBook.name == config.NOTEBOOK_NAME) {
                                    console.log("notebook name", noteBook.name);
                                    notebookGuid = noteBook.guid;
                                    console.log("notebook guid", notebookGuid);

                                }
                            })
                            deferred.resolve(notebookGuid);
                        }

                    });
                    //			deferred.resolve(1);
                    return deferred.promise;
                })
                .then(function() {
                    var deferred = promise_lib.defer();
                    if (notebookGuid) {
                        /* This would be a request for authorisation */
                        if (req.query.callback == "auth")
                            console.log("Authorising");
                        else
                            console.log("REAUTHORISE");
                        deferred.resolve(notebookGuid);

                    } else {
                        /* Create only if the notebook is not created as yet */
                        var noteStore = client.getNoteStore();
                        var noteBookToCreate = new Evernote.Notebook();
                        noteBookToCreate.name = config.NOTEBOOK_NAME;
                        noteBookToCreate.defaultNotebook = true;

                        noteStore.createNotebook(oauthAccessToken, noteBookToCreate, function(err, noteBookResult) {
                            if (err) {
                                console.log("failed to create Notebook:", err);
                                deferred.reject(err);
                            } else {
                                console.log("Notebook created(GUID):", noteBookResult.guid);
                                deferred.resolve(noteBookResult.guid);
                            }
                        });
                    }
                    return deferred.promise;

                })
                /* Update the user with token and tokensecret */
                .then(function(noteBookGuid) {
                    //console.log("INSIDE USER UPDATE");
                    console.log("expiry date", results.edam_expires);
                    return updateUserAndPromisify(user, true, oauthAccessToken, oauthAccessTokenSecret, noteBookGuid, results.edam_expires);
                })
                .then(function(updatedUser) {
                    req.session.passport.user = JSON.stringify(updatedUser);
                })
                .catch(function(error) {
                    console.log("error in catch", error);
                    ViewHelperUtil.addToErrors(errors, error);
                })
                .done(function() {
                    console.log("erros", errors);
                    res.redirect('/private/player/course/' + encodeURIComponent(courseId) + '#/notes');
                })
            }
        });
}

function updateUserAndPromisify(user, authorise, tokenOauthAccess, tokenSecretOauthAccess, noteBookGuid, authExpiry) {
    UserModel = mongoose.model('UserModel');
    var deferred = promise_lib.defer();
    var date = new Date();
    promise_lib.resolve()
        .then(function() {
            var subDeferred = promise_lib.defer();
            console.log('updating user model...');
            UserModel.update({
                identifier: user.identifier
            }, {
                $set: {
                    "noteSettings.authorise": authorise,
                    "noteSettings.evernoteAccess.token": tokenOauthAccess,
                    "noteSettings.evernoteAccess.tokenSecret": tokenSecretOauthAccess,
                    "noteSettings.evernoteAccess.notebookGuid": noteBookGuid,
                    "noteSettings.evernoteAccess.lastAccessedOn": date,
                    "noteSettings.authExpiry": authExpiry
                }
            }).exec(function(err, user) {
                if (err) {
                    console.log('Error Updating UserModel - ', err);
                    subDeferred.reject();
                } else {
                    console.log("user updated");
                    subDeferred.resolve();
                }
            });
            return subDeferred.promise;
        })
    .then(function() {
        UserModel.findOne({ identifier: user.identifier}).exec(function(err, user) {
                if (err) {
                    console.log('Error Updating UserModel - ', err);
                    deferred.reject();
                } else {
                    deferred.resolve(user);
                }
            });
    })
    .catch(function(err) {
        deferred.reject(err);
        console.log(err);
    })
    return deferred.promise;
}



// OAuth callback
exports.oauth_callbackOld = function(req, res) {
    var errors = [];
    var client = new Evernote.Client({
        consumerKey: config.API_CONSUMER_KEY,
        consumerSecret: config.API_CONSUMER_SECRET,
        sandbox: config.SANDBOX
    });
    var user = req.user;
    client.getAccessToken(req.session.oauthToken, req.session.oauthTokenSecret, req.param('oauth_verifier'),
        function(error, oauthAccessToken, oauthAccessTokenSecret, results) {

            if (error) {
                /* Evernote returns 401 error for decline and revoke */
                if (error.statusCode == 401) {
                    /* Handling Decline case */
                    if (req.query.callback == "auth") {
                        console.log("User declined Authorisation");
                        //		ViewHelperUtil.addToErrors(errors, error);
                        res.redirect('/private/player/notebook');
                    } else {
                        /* Revoke */
                        console.log("REVOKING AUTHORISATION");
                        promise_lib.resolve()
                            .then(function() {
                                //console.log("INSIDE REVOKE");
                                return updateUserAndPromisify(user, false, "", "", user.noteSettings.evernoteAccess.notebookGuid, "");
                            })
                            .then(function(updatedUser) {
                                req.session.passport.user = JSON.stringify(updatedUser);
                            })
                            .catch(function(error) {
                                console.log("error in catch", error);
                                ViewHelperUtil.addToErrors(errors, error);
                            })
                            .done(function() {
                                res.redirect('/private/player/notebook');
                            })
                    }
                } else {
                    /* log any other errors */
                    ViewHelperUtil.addToErrors(errors, error);
                    res.redirect('/private/player/notebook');
                }
            } else {
                promise_lib.resolve()
                    /* Create notebook in User's account */
                    .then(function() {
                        var deferred = promise_lib.defer();
                        if (req.query.callback == "auth" && !user.noteSettings.evernoteAccess.notebookGuid) /* This would be a request for authorisation */ {
                            /* Create only if the notebook is not created as yet */

                            var noteStore = client.getNoteStore();
                            var noteBookToCreate = new Evernote.Notebook();
                            noteBookToCreate.name = config.NOTEBOOK_NAME;
                            noteBookToCreate.defaultNotebook = true;
                            noteStore.createNotebook(oauthAccessToken, noteBookToCreate, function(err, noteBookResult) {
                                if (err) {
                                    console.log("failed to create Notebook:", err);
                                    deferred.reject(err);
                                } else {
                                    console.log("Notebook created(GUID):", noteBookResult.guid);
                                    deferred.resolve(noteBookResult.guid);
                                }
                            });
                        } else {
                            /*Reauthorisation case */
                            console.log("REAUTHORSING ", user.noteSettings.evernoteAccess.notebookGuid);
                            deferred.resolve(user.noteSettings.evernoteAccess.notebookGuid);
                        }
                        return deferred.promise;
                    })
                    /* Update the user with token and tokensecret */
                    .then(function(noteBookGuid) {
                        //console.log("INSIDE USER UPDATE");
                        console.log("expiry date", results.edam_expires);
                        return updateUserAndPromisify(user, true, oauthAccessToken, oauthAccessTokenSecret, noteBookGuid, results.edam_expires);
                    })
                    /* Update the session */
                    .then(function(updatedUser) {
                        req.session.passport.user = JSON.stringify(updatedUser);
                    })
                    .catch(function(error) {
                        console.log("error in catch", error);
                        ViewHelperUtil.addToErrors(errors, error);
                    })
                    .done(function() {
                        res.redirect('/private/player/notebook');
                    });
            }
        })
}



function updateUserAndPromisifyOld(user, authorise, tokenOauthAccess, tokenSecretOauthAccess, noteBookGuid, authExpiry) {
    UserModel = mongoose.model('UserModel');
    var deferred = promise_lib.defer();
    promise_lib.resolve()
        .then(function() {
            var subDeferred = promise_lib.defer();
            UserModel.update({
                identifier: user.identifier
            }, {
                $set: {
                    "noteSettings.authorise": authorise,
                    "noteSettings.evernoteAccess.token": tokenOauthAccess,
                    "noteSettings.evernoteAccess.tokenSecret": tokenSecretOauthAccess,
                    "noteSettings.evernoteAccess.notebookGuid": noteBookGuid,
                    "noteSettings.authExpiry": authExpiry
                }
            }).exec(function(err, user) {
                if (err) {
                    console.log('Error Updating UserModel - ', err);
                    subDeferred.reject();
                } else {
                    subDeferred.resolve(user);
                    console.log("updated user", user);
                }
            });
            return subDeferred.promise;
        })
        .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{
            identifier: user.identifier
        }]))
        .then(function(returnedUser) {
            deferred.resolve(returnedUser);
        })
        .catch(function(err) {
            deferred.reject(err);
            console.log(err);
        })
    return deferred.promise;
}

function generateURL(req, calbackParam) {
    return req.protocol + '://' + req.get('host') + '/private/v1/everNote/oauth_callback' + '?callback=' + calbackParam;
}

/************************************************************************************************************************/

exports.saveNote = function(req, res) {
    var errors = [];
    NoteModel = mongoose.model('NoteModel');
    // var noteModel = new NoteModel();
    var body = req.body;
    var note;
    console.log("NOTE BODY", req.body);
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(NoteModel.findOne, NoteModel, [{
            identifier: body.identifier
        }]))
        .then(function(noteModel) {
            if (noteModel == null) {
                noteModel = new NoteModel();
                noteModel.identifier = noteModel._id;
                noteModel.learnerId = getUserId(req);
            } else if (noteModel.learnerId != getUserId(req)) {
                var err = new Error('No Permission');
                throw err;
            }
            // console.log("Note in DB: " + noteModel + " ");
            // Populate model to be saved to MongoDB
            for (var k in body) {
                if (k != "__v" && k != "_id") {
                    if (k == 'courseId' || k == 'elementId') {
                        var id = body[k];
                        if (id.indexOf(PlayerUtil.fedoraPrefix) < 0) {
                            id = PlayerUtil.addFedoraPrefix(id);
                            body[k] = id;
                        }
                    }
                    noteModel[k] = body[k];
                }
            }

            // Always, time has to be set 
            noteModel.updatedOn = new Date();
            if (!noteModel.version) {
                noteModel.version = 1;
            } else {
                noteModel.version += 1;
            }

            var deferred = promise_lib.defer();
            console.log("saving to pcp", noteModel);
            noteModel.save(function(err, object) {
                if (err) {
                    deferred.reject(err);
                } else {
                    note = object;
                    deferred.resolve(object);
                }
            });
            return deferred.promise;
        })
        .then(function() {
            // Don't make the response depend on saving in evernote
            promise_lib.resolve()
                .then(ViewHelperUtil.promisifyWithArgs(user.getUser, user, [getUserId(req)]))
                .then(function(user) {

                    if (user.noteSettings) {
                        if (user.noteSettings.evernoteAccess) {
                            console.log('Saving to Evernote');
                            evernoteAuthToken = user.noteSettings.evernoteAccess.token;
                            var client = new Evernote.Client({
                                token: evernoteAuthToken,
                                sandbox: false
                            });
                            var noteStore = client.getNoteStore();
                            /*While creating a note for the first time, note.evernoteNoteId will always be null*/

                            if (!note.evernoteNoteId) {
                                console.log('Create in Evernote with noteId', note.evernoteNoteId);
                                makeNote(noteStore, note, user.noteSettings.evernoteAccess.notebookGuid, function(noteResult) {
                                    console.log("Saved Evernote for id: " + note.identifier + " guid: " + noteResult.guid);
                                    //	console.log("with contents: ",noteResult);
                                    note.evernoteNoteId = noteResult.guid;
                                    note.evernoteUpdated = noteResult.updated;

                                    note.update({
                                        evernoteNoteId: noteResult.guid,
                                        evernoteUpdated: noteResult.updated,
                                        evernoteSyncedVersion: note.version
                                    }, {
                                        w: 1
                                    }, function(err, object) {
                                        if (err) {} else {}
                                    });
                                    // note.save(function(err, object) {
                                    // 	if(err) {
                                    // 	} else {
                                    // 		note = object;
                                    // 	}
                                    // });
                                });

                            } else {
                                console.log('Update in Evernote with noteId', note.evernoteNoteId);


                                updateNote(noteStore, note, user.noteSettings.evernoteAccess.notebookGuid, false, function(noteResult) {
                                    console.log("Updated Evernote for id: " + note.identifier + " guid: " + noteResult.guid);
                                    // TODO change this to mongo update to make this atomic
                                    // note.evernoteNoteId = noteResult.guid;
                                    note.evernoteUpdated = noteResult.updated;
                                    note.update({
                                        evernoteUpdated: noteResult.updated,
                                        evernoteSyncedVersion: note.version
                                    }, {
                                        w: 1
                                    }, function(err, object) {
                                        if (err) {} else {}
                                    });
                                    // note.save(function(err, object) {
                                    // 	if(err) {
                                    // 	} else {
                                    // 		note = object;
                                    // 	}
                                    // });
                                });
                            }
                        }
                    }
                })
                .catch(function(error) {})
                .done(function() {});

        })
        .catch(function(error) {
            ViewHelperUtil.addToErrors(errors, error);
        })
        .done(function() {
            if (errors.length > 0) {
                console.log('failed to save note ', errors);
                ViewHelperUtil.handleError(res, errors);
            } else {
                res.send(JSON.stringify(note));
            }
        });

};

exports.findById = function(req, res) {
    var errors = [];
    NoteModel = mongoose.model('NoteModel');
    var userId = getUserId(req);
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(NoteModel.findOne, NoteModel, [{
            identifier: req.params.id,
            learnerId: userId
        }]))
        .done(function(note) {
            if (errors.length > 0) {
                console.log('failed to get note', errors);
            } else {
                res.send(note);
            }
        });
};

exports.delete = function(req, res) {
    var errors = [];
    var noteStore = null;
    NoteModel = mongoose.model('NoteModel');
    promise_lib.resolve()
        .then(function() {
            if (req.user.noteSettings && req.user.noteSettings.evernoteAccess) {
                var client = new Evernote.Client({
                    token: req.user.noteSettings.evernoteAccess.token,
                    sandbox: false
                });
                noteStore = client.getNoteStore();
            }
        })
        .then(ViewHelperUtil.promisifyWithArgs(NoteModel.findOne, NoteModel, [{
            identifier: req.params.id
        }]))
        .then(function(note) {
            /*noteStore.deleteNote(note.evernoteId, function(err, noteResult){
					if (err) {
						// Something was wrong with the note data
						// See EDAMErrorCode enumeration for error code explanation
						// http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
						console.log(err);
					} else {
						console.log("note update succesful",noteResult);
						//callback(noteResult);
					}
		}); */
            if (noteStore && noteStore != null) {
                updateNote(noteStore, note, req.user.noteSettings.evernoteAccess.notebookGuid, true, function(noteResult) {
                    console.log("Deleted note in Evernote for id: " + note.identifier + " guid: " + noteResult.guid);
                    // TODO change this to mongo update to make this atomic
                    // note.evernoteNoteId = noteResult.guid;
                });
            }
        })
        .then(ViewHelperUtil.promisifyWithArgs(NoteModel.remove, NoteModel, [{
            identifier: req.params.id
        }]))
        .catch(function(err) {
            console.log('failed to delete note', err);
            ViewHelperUtil.addToErrors(errors, err);
        })
        .done(function() {
            if (errors.length > 0) {
                console.log('failed to delete note', errors);
            } else {
                res.send();
            }
        });
};

exports.findAll = function(req, res) {
    var errors = [];
    NoteModel = mongoose.model('NoteModel');

    var userId = getUserId(req);
    // always filter by user id
    var noteFilter = {
        learnerId: userId
    };

    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(exports.getNotes, this, [req.body, true, req]))
        .catch(function(error) {
            ViewHelperUtil.addToErrors(errors, error);
        })
        .done(function(noteList) {
            if (errors.length > 0) {
                console.log('failed to get note', errors);
            } else {
                // console.log(noteList);
                res.send(noteList);
            }
        });
};


exports.getNotes = function(uiFilter, isActive, req, callback) {
    console.log("inside getnotes");

    var errors = [];
    NoteModel = mongoose.model('NoteModel');
    var userId = getUserId(req);
    //console.log("user id",userId);
    // always filter by user id
    var noteFilter = {
        learnerId: userId
    };
    promise_lib.resolve()
        .then(function() {

            var body = uiFilter;
            if (body) {
                // var noteFilter = {};
                if (body.location) {
                    noteFilter['location.course'] = body.location;
                }

                if (isActive != false) {
                    noteFilter.deleted = {
                        $in: [null, false]
                    };
                }

                var deferred = promise_lib.defer();
                user.saveNoteFilter({
                    userId: userId,
                    noteFilter: body
                }, function(err, user) {
                    if (err) {
                        errors.concat(err);
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }

                });
                return deferred.promise;
            }
        })
        .then(ViewHelperUtil.promisifyWithArgs(NoteModel.find, NoteModel, [noteFilter]))
        .catch(function(error) {
            console.log("inside getNotes catch", error);
            ViewHelperUtil.addToErrors(errors, error);
        })
        .done(function(noteList) {
            if (errors.length > 0) {
                console.log('failed to get note', errors);
                callback(errors);
            } else {
                //	console.log("notesList from getNotes",noteList);
                callback(null, noteList);
            }
        });
}



// Gets user id from session
// TODO actual implementation
function getUserId(req) {
    return req.user.identifier;
}

function makeNote(noteStore, note, parentNotebookId, callback) {
    // console.log('start makeNote: ' + note + '\n' + parentNotebookId);
    var noteTitle = note.title;
    var noteBody = note.content;
    var noteLocation = '';
    if (note.location.lecture || note.location.course) {
        var noteLocationName = (note.location.lecture) ? note.location.lecture : note.location.course;
        noteLocation = '<br/><br/>' + 'Note Location: <a href="' + note.url + '">' + noteLocationName + '</a>';
    }

    //var noteLocation = "";
    //	var noteBody = '<h2><span style="-evernote-last-insertion-point:true;"/>Try me!</h2>\n<p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p>\n<p><b>Features:</b></p>\n<ol>\n<li>Automatic Seamless Two-Way-Binding</li>\n<li>Super Easy <b>Theming</b> Options</li>\n<li style="color: green;">Simple Editor Instance Creation</li>\n<li>Safely Parses Html for Custom Toolbar Icons</li>\n<li>Doesn\'t Use an iFrame</li>\n<li>Works with Firefox, Chrome, and IE8+</li>\n</ol>\n<br/>';
    var nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
    nBody += "<en-note>" + noteBody + noteLocation + "</en-note>";

    // Create note object


    var noteToCreate = new Evernote.Note();
    noteToCreate.title = noteTitle;
    noteToCreate.content = nBody;

    noteToCreate.notebookGuid = parentNotebookId;

    if (note.tags) {
        var tagNames = [];
        noteToCreate.tagNames = tagNames.concat(note.tags);
        // console.log('noteToCreate: ' + noteToCreate + " , " + tagNames) ;
    }
    console.log("note created in evernote", noteToCreate);
    // Attempt to create note in Evernote account
    noteStore.createNote(noteToCreate, function(err, noteResult) {
        if (err) {
            // Something was wrong with the note data
            // See EDAMErrorCode enumeration for error code explanation
            // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
            console.log(err);
        } else {
            callback(noteResult);
        }
    });
}



function updateNote(noteStore, note, parentNotebookId, deleteNote, callback) {
    var noteToUpdate = new Evernote.Note();
    noteToUpdate.notebookGuid = parentNotebookId;
    noteToUpdate.guid = note.evernoteNoteId;

    if (deleteNote) {
        noteStore.deleteNote(noteToUpdate.guid, function(err, noteResult) {
            if (err) {
                // Something was wrong with the note data
                // See EDAMErrorCode enumeration for error code explanation
                // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
                console.log(err);
            } else {
                console.log("note update succesful");
                callback(noteResult);
            }
        });
    } else {
        noteToUpdate.title = note.title;
        console.log("notes in updateNotes", note);
        console.log("noteId in updateNote", note.evernoteNoteId);
        var noteLocation = '';
        if (note.location.lecture || note.location.course) {
            var noteLocationName = (note.location.lecture) ? note.location.lecture : note.location.course;
            noteLocation = '<br/><br/>' + 'Note Location: <a href="' + note.url + '">' + noteLocationName + '</a>';
        }

        var nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
        nBody += "<en-note>" + note.content + noteLocation + "</en-note>";
        noteToUpdate.content = nBody;

        if (note.tags) {
            var tagNames = [];
            noteToUpdate.tagNames = tagNames.concat(note.tags);
        }
        console.log("updated note", noteToUpdate);
        noteStore.updateNote(noteToUpdate, function(err, noteResult) {
            if (err) {
                // Something was wrong with the note data
                // See EDAMErrorCode enumeration for error code explanation
                // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
                console.log(err);
            } else {
                console.log("note update succesful");
                callback(noteResult);
            }
        });
    }






    // noteStore.getNote(note.evernoteNoteId, true, false, false, false, function(err, noteResult) {
    // 	if (err) {
    // 		// Something was wrong with the note data
    // 		// See EDAMErrorCode enumeration for error code explanation
    // 		// http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
    // 		console.log(err);
    // 	} else {
    // 				console.log(noteResult);
    // 		noteResult.title = note.title;
    // 		noteResult.content = note.content;
    // 		noteResult.contentHash = null;
    // 		noteResult.contentLength = null;
    // 		noteStore.updateNote(noteResult, function(err2, noteResult2){
    // 			if (err2) {
    // 				// Something was wrong with the note data
    // 				// See EDAMErrorCode enumeration for error code explanation
    // 				// http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
    // 				console.log(err);
    // 			} else {
    // 				console.log(noteResult2);
    // 			}
    // 		});
    // 	}
    // });
}

exports.getDefaultNotesList = function(req, res) {
    var studentId = getUserId(req);
    var noteFilter = {
        courseId: {
            $exists: false
        }
    };
    createNotesListResponse(req, res, studentId, noteFilter, true);
};

exports.getCourseNotesList = function(req, res) {
    var studentId = getUserId(req);
    var courseId = decodeURIComponent(req.params.courseId);
    if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    var noteFilter = {
        courseId: courseId
    };
    createNotesListResponse(req, res, studentId, noteFilter);
};

exports.getNotesList = function(req, res) {
    var studentId = getUserId(req);
    var courseId = decodeURIComponent(req.params.courseId);
    var noteFilter = {
        courseId: courseId
    };
    if (req.params.elementId) {
        var elementId = decodeURIComponent(req.params.elementId);
        if (elementId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
            elementId = PlayerUtil.addFedoraPrefix(elementId);
        }
        noteFilter.elementId = elementId;
    }
    if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    createNotesListResponse(req, res, studentId, noteFilter);
};

function createNotesListResponse(req, res, studentId, noteFilter, isDefault) {
    var skipNoteCount = req.params.skipCount;
    var notes;
    noteFilter.learnerId = studentId;
    noteFilter.deleted = {
        $in: [null, false]
    };
    NoteModel = mongoose.model('NoteModel');
    LearnerStateModel = mongoose.model('LearnerStateModel');
    promise_lib.resolve()
        .then(function() {
            var deferred = promise_lib.defer();

            NoteModel.find(noteFilter).skip(skipNoteCount * appConfig.DEFAULT_RESULT_SIZE).limit(appConfig.DEFAULT_RESULT_SIZE).sort({
                updatedOn: -1
            }).lean().exec(function(err, noteList) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(noteList);
                }
            });
            return deferred.promise;
        }).then(function(notes) {
            var response = {};
            response.noteList = notes;

            /*to show/hide show more option*/
            if (response.noteList.length < appConfig.DEFAULT_RESULT_SIZE || response.noteList == null || !response.noteList)
            	response.showMore = false;
            else
            	response.showMore = true;

            var today = new Date;
            if(req.user.noteSettings && req.user.noteSettings.evernoteAccess) {
            	if (req.user.noteSettings.evernoteAccess.token && req.user.noteSettings.authExpiry) {
	                if (Date.parse(today) <= req.user.noteSettings.authExpiry)
	                    response.authorise = true;
	            } else
	                response.authorise = false;
	            if (req.user.noteSettings.evernoteAccess.lastAccessedOn) {
	                response.lastAccessedOn = req.user.noteSettings.evernoteAccess.lastAccessedOn;
	            }

	            if (req.user.noteSettings.evernoteAccess.lastSyncedOn) {
	                response.lastSyncedOn = req.user.noteSettings.evernoteAccess.lastSyncedOn;
	            }
            }

            res.send(JSON.stringify(response));
        }).catch(function(err) {
            errorModule.handleError(err, "ERROR_GETTING_NOTES", req, res);
        }).done();
}

exports.getNotesBrowser = function(req, res) {
    var studentId = req.user.identifier;
    EnrolledCoursesModel = mongoose.model('EnrolledCoursesModel');
    LearnerStateModel = mongoose.model('LearnerStateModel');
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(LearnerStateModel.find, LearnerStateModel, [{
            student_id: studentId
        }]))
        .then(function(courses) {
            var courseMap = {};
            var moduleMap = {};
            var lessonMap = {};
            var lectureMap = {};
            if (courses && courses.length > 0) {
                courses.forEach(function(learnerState) {
                    buildNotesBrowserMaps(learnerState, courseMap, moduleMap, lessonMap, lectureMap)
                });
            }
            var notesBrowser = {};
            notesBrowser.courseMap = courseMap;
            notesBrowser.moduleMap = moduleMap;
            notesBrowser.lessonMap = lessonMap;
            notesBrowser.lectureMap = lectureMap;
            res.send(JSON.stringify(notesBrowser));
        }).catch(function(err) {
            errorModule.handleError(err, "ERROR_GETTING_COURSE", req, res);
        }).done();
};

function buildNotesBrowserMaps(learnerState, courseMap, moduleMap, lessonMap, lectureMap) {
    var lobMap = PlayerUtil.getMap(learnerState.learning_objects);
    var elementMap = PlayerUtil.getMap(learnerState.elements);
    var courseLob = lobMap[learnerState.courseId];
    var course = getMapObject(courseLob, learnerState.courseId);
    course.level = 0;
    course.courseId = course.id;
    course.parentId = course.id;
    courseMap[course.id] = course;
    if (courseLob.sequence && courseLob.sequence.length > 0) {
        courseLob.sequence.forEach(function(moduleId) {
            var module = getObject(moduleId, lobMap, elementMap);
            if (module) {
                if (module.sequence && module.sequence.length > 0) {
                    module.sequence.forEach(function(lessonId) {
                        var lessonObjId = PlayerUtil.addFedoraPrefix(lessonId + '');
                        var lesson = getObject(lessonObjId, lobMap, elementMap);
                        if (lesson) {
                            if (lesson.sequence && lesson.sequence.length > 0) {
                                lesson.sequence.forEach(function(lectureId) {
                                    var lectureObjId = PlayerUtil.addFedoraPrefix(lectureId + '');
                                    var lecture = getObject(lectureObjId, lobMap, elementMap);
                                    if (lecture) {
                                        lecture.level = 3;
                                        lecture.parentId = lesson.id;
                                        lecture.moduleId = module.id;
                                        lecture.courseId = course.id;
                                        lectureMap[lecture.id] = lecture;
                                    }
                                });
                            }
                            lesson.level = 2;
                            lesson.parentId = module.id;
                            lesson.courseId = course.id;
                            lessonMap[lesson.id] = lesson;
                        }
                    });
                }
                module.level = 1;
                module.parentId = course.id;
                module.courseId = course.id;
                moduleMap[module.id] = module;
            }
        });
    }
}

function getObject(objectId, lobMap, elementMap) {
    var object;
    if (lobMap[objectId]) {
        var lob = lobMap[objectId];
        object = getMapObject(lob, objectId);
    } else if (elementMap[objectId]) {
        var lob = elementMap[objectId];
        object = getMapObject(lob, objectId);
    }
    return object;
}

function getMapObject(lob, objectId) {
    var object = {};
    object.id = PlayerUtil.removeFedoraPrefix(objectId + "");
    object.name = lob.name;
    object.type = lob.elementType;
    object.sequence = [];
    var seq = lob.sequence;
    if (seq && seq.length > 0) {
        seq.forEach(function(seqId) {
            object.sequence.push(PlayerUtil.removeFedoraPrefix(seqId + ""));
        });
    }
    return object;
}

exports.syncEvernoteOld = function(req, res) {
    var errors = [];

    var percNotes = null;
    var noteStore = null;
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(exports.getNotes, this, [null, false, req]))
        .then(function(noteList) {
            percNotes = noteList;
            //console.log("Perceptron Notes List",percNotes);
        })
        .then(ViewHelperUtil.promisifyWithArgs(user.getUser, user, [getUserId(req)]))
        .then(function(user) {
            //console.log("user notesettings: ",user.noteSettings);
            if (user.noteSettings) {
                if (user.noteSettings.evernoteAccess) {
                    evernoteAuthToken = user.noteSettings.evernoteAccess.token;
                    var client = new Evernote.Client({
                        token: evernoteAuthToken,
                        sandbox: false
                    });
                    noteStore = client.getNoteStore();
                    //	console.log("notestore obtained");
                    var evernoteFilter = new Evernote.NoteFilter();
                    evernoteFilter.notebookGuid = user.noteSettings.evernoteAccess.notebookGuid;

                    var spec = new Evernote.NotesMetadataResultSpec();
                    spec.includeUpdated = true;
                    spec.includeDeleted = true;
                    //console.log("nootesettings");
                    //	console.log(spec);
                    //
                    return ViewHelperUtil.promisifyWithArgs(noteStore.findNotesMetadata, noteStore, [evernoteFilter, 0, 100, spec]);

                    // noteStore.findNotesMetadata(evernoteFilter, 0, 100, spec, function (err, notesMetadataList) {
                    // 	console.log(notesMetadataList);
                    // });
                }
            }

            var err = new Error('Evernote Note setup');
            throw err;
        })
        .then(function(func) {
            return func();
        })
        .then(function(notesMetadataList) {
            var evernotes = {};
            if (notesMetadataList.notes) {
                notesMetadataList.notes.forEach(function(note) {
                    evernotes[note.guid] = note;
                    evernotes[note.guid].isSynced = false;
                });
            }
            //	console.log("Evernote notes list", evernotes);

            if (percNotes) {
                // TODO use promise all
                percNotes.forEach(function(percNote) {

                    // Handle deletes in evernote. For now repopulate as new note in evernote
                    if (percNote.evernoteNoteId && !evernotes[percNote.evernoteNoteId]) {
                        percNote.evernoteNoteId = null;
                        //	delete percNote.evernoteNoteId;
                    }
                    if (percNote.evernoteNoteId) {
                        // this is update
                        var evernote = evernotes[percNote.evernoteNoteId];

                        if (percNote.version > percNote.evernoteSyncedVersion) {
                            //console.log("percnote version",percNote.version);
                            //console.log("pcpnote enote synched version",percNote.evernoteSyncedVersion);
                            // percnote is the latest

                        } else if (evernote.updated > percNote.evernoteUpdated) {
                            //console.log("update from evernote",evernote.updated);
                            //console.log("enote evernote in pcp",percNote.evernoteUpdated);
                            // evernote is the latest
                            noteStore.getNote(percNote.evernoteNoteId, true, false, false, false, function(err, noteResult) {
                                if (err) {
                                    console.log("error before pcpnote is updated");
                                } else {
                                    percNote.title = noteResult.title;

                                    percNote.content = noteResult.content;
                                    var re = /(?:.|[\r\n])*\<en-note\>(.*)\<\/en-note\>(?:.|[\r\n])*/;
                                    // console.log('Content:'+noteModel.content);
                                    percNote.content = percNote.content.replace(re, "$1");
                                    // console.log('Content after parse:'+noteModel.content);

                                    // TODO use getNoteTagNames
                                    percNote.tags = noteResult.tagNames;
                                    percNote.evernoteUpdated = noteResult.updated;


                                    percNote.update({
                                        evernoteUpdated: noteResult.updated,
                                        content: percNote.content,
                                        title: percNote.title,
                                        $inc: {
                                            version: 1
                                        },
                                        evernoteSyncedVersion: version
                                    }, {
                                        w: 1
                                    }, function(err, object) {
                                        if (err) {} else {}
                                    });

                                }
                            });
                            //console.log("pcpnote after update",percNote);
                            //console.log("note from enote",evernote);
                        }
                        evernote.isSynced = true;

                    } else {
                        // TODO implement new per notes sync
                    }

                });
            }

            /*	if (notesMetadataList.notes) {
     		var i = 1;
     		console.log("inside notesmetadatalist");
			notesMetadataList.notes.forEach(function(evernote) {
				console.log("entered metaDataList");
				if (!evernote.isSynced) {
					console.log("isSynced is false for id",evernote.guid);
					promise_lib.resolve()
					.then(ViewHelperUtil.promisifyWithArgs(noteStore.getNote, noteStore, [evernote.guid, true, false, false, false]))
				    .then(function(noteResult) {
				    	console.log("note from notestore",noteResult);
			    		var noteModel = new NoteModel();
			    		noteModel.identifier = noteModel._id;
			    		noteModel.learnerId = getUserId(req);		    	
						noteModel.version = 1;
						noteModel.evernoteNoteId = noteResult.guid;
						noteModel.evernoteUpdated = noteResult.updated;
						noteModel.evernoteSyncedVersion = 1;
						noteModel.title = noteResult.title;
						
						noteModel.content = noteResult.content;
						var re = /(?:.|[\r\n])*\<en-note\>(.*)\<\/en-note\>(?:.|[\r\n]);
						console.log('Content:'+noteModel.content);
						noteModel.content = noteModel.content.replace(re, "$1");
						console.log('Content after parse:'+noteModel.content);
						console.log("note model after applying regular expression",noteModel);
						
						var deferred = promise_lib.defer();
						noteStore.getNoteTagNames(noteModel.evernoteNoteId, function(err, tagNames) {
							if(err) {
								deferred.reject(err);
							} else {
								noteModel.tags = tagNames;
								deferred.resolve(noteModel);
							}
						});
						return deferred.promise;
					})
					.then(function(noteModel) {
						var deferred = promise_lib.defer();
						noteModel.save(function(err, object) {
							if(err) {
								deferred.reject(err);
							} else {								
								deferred.resolve(object);								
							}
						});		
					//	console.log("saved notemodel",noteModel);			
						return deferred.promise;
					})
				    .catch(function (error) {
				    	console.log("error in catch", error);
						ViewHelperUtil.addToErrors(errors, error);
					})
				    .done(function(note) {
				        if(errors.length > 0) {
				            console.log('failed to save note ',errors);
				            // ViewHelperUtil.handleError(res, errors);
				        } else { 
				         //   console.log('Saved note: ' + note.identifier);
				            // res.send();
				        }
				    });

					

				}
			});

		} */

        })
        .catch(function(error) {
            console.log('last catch', error);
            ViewHelperUtil.addToErrors(errors, error);
        })
        .done(function() {
            if (errors.length > 0) {
                console.log('failed to save note ', errors);
                ViewHelperUtil.handleError(res, errors);
            } else {
                //  res.send();
                res.redirect('/private/v1/player/notebook');
            }
        });
}

/*******************************************/
/*****ENOTE SYNCHRONISATION*****************/

/**********************/

exports.syncSample1 = function(req, res) {
    var note = req.body;
    var user = req.user;
    var notebookGuid = user.noteSettings.evernoteAccess.notebookGuid;
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(exports.getNotes, this, [null, false, req]))
        .then(function(noteList) {
            //console.log("notesList",noteList);
            percNotes = noteList;
            console.log("first then");
            if (user.noteSettings) {
                if (user.noteSettings.evernoteAccess) {
                    evernoteAuthToken = user.noteSettings.evernoteAccess.token;
                    var client = new Evernote.Client({
                        token: evernoteAuthToken,
                        sandbox: false
                    });
                    noteStore = client.getNoteStore();
                    var evernoteFilter = new Evernote.NoteFilter();
                    evernoteFilter.notebookGuid = notebookGuid;
                    console.log("filter", evernoteFilter);
                    var spec = new Evernote.NotesMetadataResultSpec();
                    spec.includeUpdated = true;
                    spec.includeDeleted = true;
                    return ViewHelperUtil.promisifyWithArgs(noteStore.findNotesMetadata, noteStore, [evernoteFilter, 0, 100, spec]);
                }
            }
            var err = new Error('Evernote Note setup');
            throw err;
        })
        .then(function(func) {
            console.log("second then");
            return func();
        })
        .then(function(notesMetadataList) {
            //	console.log("metadata list",notesMetadataList);
            console.log("third then");
            var deferred = promise_lib.defer();
            var evernotes = {};
            if (notesMetadataList.notes) {
                notesMetadataList.notes.forEach(function(note) {
                    evernotes[note.guid] = note;
                    evernotes[note.guid].isSynced = false;
                });
            }
            deferred.resolve(evernotes);
            return deferred.promise;
        })
        .then(function(evernotes) {
            console.log("fourth then");
            var evernote = evernotes[note.evernoteNoteId];
            return syncEnoteWithPnote(note, evernote, noteStore, notebookGuid);
        })
        .then(function(updatedNote) {
            console.log("fifth then");
            console.log("updated note", updatedNote);
            res.send(updatedNote);
        })
        .catch(function(err) {
            console.log("error updating", err);
        })
}


exports.syncSample2 = function(req, res) {
    //var note = null;
    var user = req.user;
    var notebookGuid = user.noteSettings.evernoteAccess.notebookGuid;
    var evernotes = {};
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(exports.getNotes, this, [null, false, req]))
        .then(function(noteList) {
            //console.log("notesList",noteList);
            percNotes = noteList;
            console.log("first then");
            if (user.noteSettings) {
                if (user.noteSettings.evernoteAccess) {
                    evernoteAuthToken = user.noteSettings.evernoteAccess.token;
                    var client = new Evernote.Client({
                        token: evernoteAuthToken,
                        sandbox: false
                    });
                    noteStore = client.getNoteStore();
                    var evernoteFilter = new Evernote.NoteFilter();
                    evernoteFilter.notebookGuid = notebookGuid;
                    console.log("filter", evernoteFilter);
                    var spec = new Evernote.NotesMetadataResultSpec();
                    spec.includeUpdated = true;
                    spec.includeDeleted = true;
                    return ViewHelperUtil.promisifyWithArgs(noteStore.findNotesMetadata, noteStore, [evernoteFilter, 0, 100, spec]);
                }
            }
            var err = new Error('Evernote Note setup');
            throw err;
        })
        .then(function(func) {
            console.log("second then");
            return func();
        })
        .then(function(notesMetadataList) {
            //	console.log("metadata list",notesMetadataList);
            console.log("third then");
            var deferred = promise_lib.defer();
            if (notesMetadataList.notes) {
                notesMetadataList.notes.forEach(function(note) {
                    evernotes[note.guid] = note;
                    evernotes[note.guid].isSynced = false;
                });
            }
            deferred.resolve();
            return deferred.promise;
        })
        .then(ViewHelperUtil.promisifyWithArgs(NoteModel.findOne, NoteModel, [{
            identifier: req.body.identifier
        }]))
        .then(function(returnedNote) {
            console.log("fourth then");
            var evernote = evernotes[returnedNote.evernoteNoteId];
            return syncPnoteWithEnote(evernote, returnedNote, noteStore);
        })
        .then(function(updatedNote) {
            console.log("fifth then");
            console.log("updated note", updatedNote);
            res.send(updatedNote);
        })
        .catch(function(err) {
            console.log("error updating", err);
        })
}

exports.syncSample3 = function(req, res) {
    //var note = null;
    var user = req.user;
    var notebookGuid = user.noteSettings.evernoteAccess.notebookGuid;
    var evernotes = {};
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(exports.getNotes, this, [null, false, req]))
        .then(function(noteList) {
            //console.log("notesList",noteList);
            percNotes = noteList;
            console.log("first then");
            if (user.noteSettings) {
                if (user.noteSettings.evernoteAccess) {
                    evernoteAuthToken = user.noteSettings.evernoteAccess.token;
                    var client = new Evernote.Client({
                        token: evernoteAuthToken,
                        sandbox: false
                    });
                    noteStore = client.getNoteStore();
                    var evernoteFilter = new Evernote.NoteFilter();
                    evernoteFilter.notebookGuid = notebookGuid;
                    console.log("filter", evernoteFilter);
                    var spec = new Evernote.NotesMetadataResultSpec();
                    spec.includeUpdated = true;
                    spec.includeDeleted = true;
                    return ViewHelperUtil.promisifyWithArgs(noteStore.findNotesMetadata, noteStore, [evernoteFilter, 0, 100, spec]);
                }
            }
            var err = new Error('Evernote Note setup');
            throw err;
        })
        .then(function(func) {
            console.log("second then");
            return func();
        })
        .then(function(notesMetadataList) {
            //	console.log("metadata list",notesMetadataList);
            console.log("third then");
            var deferred = promise_lib.defer();
            if (notesMetadataList.notes) {
                notesMetadataList.notes.forEach(function(note) {
                    evernotes[note.guid] = note;
                    evernotes[note.guid].isSynced = false;
                });
            }
            deferred.resolve();
            return deferred.promise;
        })
        .then(ViewHelperUtil.promisifyWithArgs(NoteModel.findOne, NoteModel, [{
            identifier: req.body.identifier
        }]))
        .then(function(returnedNote) {
            console.log("fourth then");
            var evernote = evernotes[returnedNote.evernoteNoteId];
            return savePnoteToEnote(evernote, returnedNote, noteStore, notebookGuid);
        })
        .then(function(updatedNote) {
            console.log("fifth then");
            console.log("updated note", updatedNote);
            res.send(updatedNote);
        })
        .catch(function(err) {
            console.log("error updating", err);
        })
}

exports.syncSample = function(req, res) {
    //var note = null;
    var user = req.user;
    var notebookGuid = user.noteSettings.evernoteAccess.notebookGuid;
    var evernotes = {};
    var notesMetadata = [];
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(exports.getNotes, this, [null, false, req]))
        .then(function(noteList) {
            //console.log("notesList",noteList);
            percNotes = noteList;
            console.log("first then");
            if (user.noteSettings) {
                if (user.noteSettings.evernoteAccess) {
                    evernoteAuthToken = user.noteSettings.evernoteAccess.token;
                    var client = new Evernote.Client({
                        token: evernoteAuthToken,
                        sandbox: false
                    });
                    noteStore = client.getNoteStore();
                    var evernoteFilter = new Evernote.NoteFilter();
                    evernoteFilter.notebookGuid = notebookGuid;
                    console.log("filter", evernoteFilter);
                    var spec = new Evernote.NotesMetadataResultSpec();
                    spec.includeUpdated = true;
                    spec.includeDeleted = true;
                    return ViewHelperUtil.promisifyWithArgs(noteStore.findNotesMetadata, noteStore, [evernoteFilter, 0, 100, spec]);
                }
            }
            var err = new Error('Evernote Note setup');
            throw err;
        })
        .then(function(func) {
            console.log("second then");
            return func();
        })
        .then(function(notesMetadataList) {
            //	console.log("metadata list",notesMetadataList);
            console.log("third then");
            var deferred = promise_lib.defer();
            var i = 0;
            if (notesMetadataList.notes) {

                notesMetadataList.notes.forEach(function(note) {
                    evernotes[note.guid] = note;
                    evernotes[note.guid].isSynced = false;
                    notesMetadata[i] = note;
                    notesMetadata[i].isSynced = false;
                    i++;
                });

            }
            deferred.resolve();
            return deferred.promise;
        })
        .then(ViewHelperUtil.promisifyWithArgs(NoteModel.findOne, NoteModel, [{
            identifier: req.body.identifier
        }]))
        .then(function() {
            console.log("fourth then");
            var promises = [];
            var deferred = promise_lib.defer();
            if (notesMetadata) {
                console.log("entered then");
                var i = 1;
                notesMetadata.forEach(function(evernote) {
                    console.log("syncing the notes in enote", evernote.isSynced);
                    if (!evernote.isSynced) {
                        promises.push(saveEnoteToPnote(evernote, noteStore, user.identifier));
                        console.log("iteration", i);
                    }
                });
                promise_lib.all(promises).then(function(value) {
                        console.log(value + " promises fulfilled");
                        deferred.resolve(value);
                    })
                    .catch(function(err) {
                        console.log("promises all error", err);
                        deferred.reject(err);
                    })
            }
            return deferred.promise;
        })
        .then(function(updatedNote) {
            console.log("fifth then");
            console.log("updated note", updatedNote);
            res.send(updatedNote);
        })
        .catch(function(err) {
            console.log("error updating", err);
        })
}



exports.syncEvernote = function(req, res) {
    var errors = [];
    var evernotes = {};
    var percNotes = null;
    var noteStore = null;
    var notesMetadata = [];
    var user = req.user;
    var courseId = req.session.courseId;
    var notebookGuid = user.noteSettings.evernoteAccess.notebookGuid;
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(exports.getNotes, this, [null, false, req]))
        .then(function(noteList) {
            //console.log("notesList",noteList);
            percNotes = noteList;
            console.log("first then");
            if (user.noteSettings) {
                if (user.noteSettings.evernoteAccess) {
                    evernoteAuthToken = user.noteSettings.evernoteAccess.token;
                    var client = new Evernote.Client({
                        token: evernoteAuthToken,
                        sandbox: false
                    });
                    noteStore = client.getNoteStore();
                    var evernoteFilter = new Evernote.NoteFilter();
                    evernoteFilter.notebookGuid = notebookGuid;
                    //	console.log("filter",evernoteFilter);
                    var spec = new Evernote.NotesMetadataResultSpec();
                    spec.includeUpdated = true;
                    spec.includeDeleted = true;
                    return ViewHelperUtil.promisifyWithArgs(noteStore.findNotesMetadata, noteStore, [evernoteFilter, 0, 100, spec]);
                }
            }
            var err = new Error('Evernote Note setup');
            throw err;
        })
        .then(function(func) {
            console.log("second then");
            return func();
        })
        .then(function(notesMetadataList) {
            //	console.log("metadata list",notesMetadataList);
            console.log("third then");
            var deferred = promise_lib.defer();

            if (notesMetadataList.notes) {
                var i = 0;
                notesMetadataList.notes.forEach(function(note) {
                    evernotes[note.guid] = note;
                    evernotes[note.guid].isSynced = false;

                    notesMetadata[i] = note;
                    notesMetadata[i].isSynced = false;
                    i++;
                });

            }
            console.log("evernotes list", evernotes);
            deferred.resolve(evernotes);
            return deferred.promise;
        })
        .then(function(evernotes) {
            console.log("fourth then");
            var deferred = promise_lib.defer();
            if (percNotes) {
                var promises = [];
                var i = 0;
                percNotes.forEach(function(percNote) {
                    // Handle deletes in evernote. For now repopulate as new note in evernote
                    if (percNote.evernoteNoteId && !evernotes[percNote.evernoteNoteId]) {
                        console.log("perc evernoteid", percNote.evernoteNoteId);
                        console.log("evernote id", evernotes[percNote.evernoteNoteId]);
                        percNote.evernoteNoteId = null;
                    }
                    console.log("perc evernoteid", percNote.evernoteNoteId);
                    var evernote = evernotes[percNote.evernoteNoteId];
                    if (percNote.evernoteNoteId) {
                        console.log("syncing updated note");
                        // this is update

                        if (percNote.version > percNote.evernoteSyncedVersion) {
                            // percnote is the latest
                            console.log("perceptron is latest");
                            promises.push(syncEnoteWithPnote(percNote, evernote, noteStore, notebookGuid));
                        } else if (evernote.updated > percNote.evernoteUpdated) {
                            // evernote is the latest
                            console.log("evernote is latest");
                            promises.push(syncPnoteWithEnote(evernote, percNote, noteStore));
                        }

                    } else {
                        // TODO implement new per notes sync
                        console.log("saving perc note to evernote");
                        promises.push(savePnoteToEnote(percNote, noteStore, notebookGuid));
                    }
                    if (evernotes[percNote.evernoteNoteId])
                        evernotes[percNote.evernoteNoteId].isSynced = true;
                });
                //  		promise_lib.all(promises).then(function(value) {
                //    	deferred.resolve(value);
                // })
                // .catch(function(err)
                // {
                // 	deferred.reject(err);
                // })
                return promise_lib.all(promises);

            }
            return deferred.promise;
        })
        .then(function(value) {
            console.log("fifth then");
            //	console.log("value returned",value);
            var promises = [];
            var deferred = promise_lib.defer();

            //if (notesMetadata) 
            if (Object.keys(evernotes).length > 0) {
                console.log("entered then");
                console.log("evernotes");
                for (evernoteId in evernotes) {
                    //	console.log("syncing the notes in enote", evernotes[evernoteId]);
                    //	console.log("evernote note",notesMetadata[i]);
                    //	if (!notesMetadata[i].isSynced) {
                    if (!evernotes[evernoteId].isSynced) {
                        //console.log("evernote note",evernote_1);
                        //		promises.push(saveEnoteToPnote(notesMetadata[i],noteStore,user.identifier));
                        promises.push(saveEnoteToPnote(evernotes[evernoteId], noteStore, user.identifier));
                        //	console.log("iteration", i);
                    }
                }
                promise_lib.all(promises).then(function(value) {
                        console.log(" promises fulfilled");
                        deferred.resolve(value);
                    })
                    .catch(function(err) {
                        console.log("promises all error", err);
                        deferred.reject(err);
                    })
            }
            return deferred.promise;

        })
        .catch(function(error) {
            console.log('last catch', error);
            ViewHelperUtil.addToErrors(errors, error);
        })
        .done(function() {
            if (errors.length > 0) {
                console.log('failed to save note ', errors);
                ViewHelperUtil.handleError(res, errors);
            } else {
                //update user last sync date...
                console.log("lastSyncedOn Update : ", user);
                UserModel = mongoose.model('UserModel');
                var date = new Date();
                console.log('updating user model lastSynced ...');
                UserModel.update({
                    identifier: user.identifier
                }, {
                    $set: {
                        "noteSettings.evernoteAccess.lastSyncedOn": date,

                    }
                }).exec(function(err, obj) {
                    if (err) {
                        console.log('Error Updating UserModel - ', err);
                    } else {
                        user.noteSettings.evernoteAccess.lastSyncedOn = date;
                    }
                });
            }
            //  res.redirect('/private/player/notebook');
        })
    res.redirect('/private/player/course/' + encodeURIComponent(courseId) + '#/notes');
}





function syncEnoteWithPnote(percNote, evernote, noteStore, notebookGuid) {
    console.log("inside syncEnoteWithPnote");
    var deferred = promise_lib.defer();

    promise_lib.resolve()
        .then(function() {
            console.log("first then in syncEnoteWithPnote");
            updateNote(noteStore, percNote, notebookGuid, false, function(noteResult) {
                console.log("Updated Evernote for id: " + percNote.identifier + " guid: " + noteResult.guid);
                NoteModel.update({
                    identifier: percNote.identifier
                }, {
                    $set: {
                        "evernoteUpdated": noteResult.updated,
                        "evernoteSyncedVersion": percNote.version

                    }
                }).exec(function(err, object) {
                    if (err) {
                        console.log("error updating notemodel", err);
                        deferred.reject(err);
                    } else
                        console.log("succesfully updated notemodel", object);
                    deferred.resolve(object);

                });

            })
        })
        .catch(function(error) {
            console.log("err in syncEnoteWithPnote", error);
            ViewHelperUtil.addToErrors(errors, error);
        })
        .done(function() {
            evernote.isSynced = true;
        })
    return deferred.promise;
}


function syncPnoteWithEnote(evernote, pNote, noteStore) {
    console.log("inside syncPnoteWithEnote");
    var percNote = new NoteModel();
    var deferred = promise_lib.defer();
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(NoteModel.findOne, NoteModel, [{
            identifier: pNote.identifier
        }]))
        .then(function(returnedNote) {
            var deferred = promise_lib.defer();
            percNote = returnedNote;
            console.log("perc note id", percNote.evernoteNoteId);
            console.log("returned note id", returnedNote.evernoteNoteId);
            deferred.resolve();
            return deferred.promise;
        })
        .then(ViewHelperUtil.promisifyWithArgs(noteStore.getNote, noteStore, [pNote.evernoteNoteId, true, false, false, false]))
        .then(function(noteResult) {
            //	console.log("Note returned",noteResult);
            console.log("first then in syncPnoteWithEnote");
            percNote.title = noteResult.title;
            percNote.content = noteResult.content;
            //	percNote.content = HTMLOfENML(noteResult.content);					

            //var re = /(?:.|[\r\n])*\<en-note\>(.*)\<\/en-note\>(?:.|[\r\n])*/;
            // console.log('Content:'+noteModel.content);
            //percNote.content = percNote.content.replace(re, "$1");
            percNote.evernoteSyncedVersion = percNote.version + 1;
            // console.log('Content after parse:'+noteModel.content);
            // TODO use getNoteTagNames
            percNote.tags = noteResult.tagNames;
            percNote.evernoteUpdated = noteResult.updated;
            percNote.update({
                evernoteUpdated: noteResult.updated,
                content: percNote.content,
                title: percNote.title,
                $inc: {
                    version: 1
                },
                evernoteSyncedVersion: percNote.evernoteSyncedVersion
            }, {
                w: 1
            }, function(err, object) {
                if (err) {
                    deferred.reject(err);
                    console.log("failed to update");
                } else {
                    deferred.resolve(object);
                }
            });
            console.log("updated percnote", percNote);
        })
        .catch(function(error) {
            deferred.reject(error);
            console.log("error before pcpnote is updated", err);
        })
    return deferred.promise;
}

function savePnoteToEnote(percNote, noteStore, notebookGuid) {
    console.log("inside savePnoteToEnote");
    var deferred = promise_lib.defer();
    promise_lib.resolve()
        /*	.then(ViewHelperUtil.promisifyWithArgs(NoteModel.findOne,NoteModel,[{identifier:pNote.identifier}]))
        	.then(function(returnedNote){
        		var percNote = new NoteModel();
        		percNote = returnedNote;
        		console.log("perc note id",percNote.identifier);
        		console.log("returned note id",returnedNote.identifier);
        		deferred.resolve(percNote);
        		return deferred.promise;
        	}) */
        .then(function() {
            console.log("first then in savePnoteToEnote");
            console.log("percnote to be saved to enote", percNote);
            //	var re = /(?:.|[\r\n])*\<en-note\>(.*)\<\/en-note\>(?:.|[\r\n])*/;
            // console.log('Content:'+noteModel.content);
            //	percNote.content = percNote.content.replace(re, "$1");
            makeNote(noteStore, percNote, notebookGuid, function(noteResult) {
                console.log("Saved Evernote for id: " + percNote.identifier + " guid: " + noteResult.guid);
                percNote.evernoteNoteId = noteResult.guid;
                percNote.evernoteUpdated = noteResult.updated;
                percNote.evernoteSyncedVersion = percNote.version
                percNote.update({
                    evernoteNoteId: noteResult.guid,
                    evernoteUpdated: noteResult.updated,
                    evernoteSyncedVersion: percNote.evernoteSyncedVersion
                }, {
                    w: 1
                }, function(err, object) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(object);
                    }
                });
            })
        })
        .catch(function(error) {
            console.log("error saving ");
            ViewHelperUtil.addToErrors(errors, error);
        })
        .done(function() {
            //evernote.isSynced = true;
            console.log("exit fro savePnoteToEnote");
        })
    return deferred.promise;

}

function saveEnoteToPnote(evernote, noteStore, userId) {
    console.log("saveEnote to Pnote");
    var noteModel = new NoteModel();
    var deferred = promise_lib.defer();
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(noteStore.getNote, noteStore, [evernote.guid, true, false, false, false]))
        .then(function(noteResult) {
            console.log("first then");
            var subDeferred = promise_lib.defer();
            noteModel.identifier = noteModel._id;
            noteModel.learnerId = userId;
            noteModel.version = 1;
            noteModel.evernoteNoteId = noteResult.guid;
            noteModel.evernoteUpdated = noteResult.updated;
            noteModel.evernoteSyncedVersion = 1;
            noteModel.title = noteResult.title;
            noteModel.content = noteResult.content;
            //	noteModel.content = HTMLOfENML(noteResult.content);
            //	console.log("note content before enml",noteResult.content);
            //	var re = /(?:.|[\r\n])*\<body[^\>]*\>(.*)\<\/body\>(?:.|[\r\n])*/m;
            //	console.log('Content:'+noteModel.content);
            //	noteModel.content = noteModel.content.replace(re, "$1");

            //   console.log("note content after enml",noteModel.content);
            //	console.log("note model",noteModel.content);
            subDeferred.resolve(noteModel);

            return subDeferred.promise;
        })
        .then(function(noteModel) {
            console.log("second then");
            var subDeferred = promise_lib.defer();
            noteStore.getNoteTagNames(noteModel.evernoteNoteId, function(err, tagNames) {
                if (err) {
                    console.log("error getting tags");
                    subDeferred.reject(err);
                } else {
                    noteModel.tags = tagNames;
                    subDeferred.resolve(noteModel);
                }
            });
            return subDeferred.promise;

        })
        .then(function(noteModel) {
            console.log("third then");
            noteModel.save(function(err, object) {
                if (err) {
                    console.log("error saving noteModel");
                    deferred.reject(err);
                } else {
                    console.log("evernote saved to perc", object);
                    deferred.resolve(object);
                }
            });
            //	console.log("saved notemodel",noteModel);			

        })
    return deferred.promise;
}

function HTMLOfENML(text, resources) {

    resources = resources || [];

    var resource_map = {}
    resources.forEach(function(resource) {

        var hex = [].map.call(resource.data.bodyHash,
            function(v) {
                str = v.toString(16);
                return str.length < 2 ? "0" + str : str;
            }).join("");

        resource_map[hex] = resource;
    })

    var writer = new XMLWriter();
    var parser = new SaxParser(function(cb) {

        var mediaTagStarted = false;
        var linkTagStarted = false;
        var linkTitle;

        cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {

            if (elem == 'en-note') {
                //   writer.startElement('html');
                //   writer.startElement('head');

                //   writer.startElement('meta');
                //  writer.writeAttribute('http-equiv', 'Content-Type');
                //   writer.writeAttribute('content', 'text/html; charset=UTF-8');
                //   writer.endElement();

                //  writer.endElement();

                //   writer.startElement('body');
                //   if(!(attrs && attrs[0] && attrs[0][0] && attrs[0][0] === 'style'))
                //      writer.writeAttribute('style', 'word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;');
            } else if (elem == 'en-todo') {

                writer.startElement('input');
                writer.writeAttribute('type', 'checkbox');

            } else if (elem == 'en-media') {

                var type = null;
                var hash = null;
                var width = 0;
                var height = 0;

                if (attrs) attrs.forEach(function(attr) {
                    if (attr[0] == 'type') type = attr[1];
                    if (attr[0] == 'hash') hash = attr[1];
                    if (attr[0] == 'width') width = attr[1];
                    if (attr[0] == 'height') height = attr[1];
                });

                var resource = resource_map[hash];

                if (!resource) return;
                var resourceTitle = resource.title || '';

                if (type.match('image')) {

                    writer.startElement('img');
                    writer.writeAttribute('title', resourceTitle);

                } else if (type.match('audio')) {


                    writer.writeElement('p', resourceTitle);
                    writer.startElement('audio');
                    writer.writeAttribute('controls', '');
                    writer.text('Your browser does not support the audio tag.');
                    writer.startElement('source');
                    mediaTagStarted = true;

                } else if (type.match('video')) {
                    writer.writeElement('p', resourceTitle);
                    writer.startElement('video');
                    writer.writeAttribute('controls', '');
                    writer.text('Your browser does not support the video tag.');
                    writer.startElement('source');
                    mediaTagStarted = true;
                } else {
                    writer.startElement('a');
                    linkTagStarted = true;
                    linkTitle = resourceTitle;
                }

                if (resource.data.body) {
                    var b64encoded = base64ArrayBuffer(resource.data.body);
                    var src = 'data:' + type + ';base64,' + b64encoded;
                    writer.writeAttribute('src', src)
                }

                if (width) writer.writeAttribute('width', width);
                if (height) writer.writeAttribute('height', height);

            } else {
                writer.startElement(elem);
            }

            if (attrs) attrs.forEach(function(attr) {
                writer.writeAttribute(attr[0], attr[1]);
            });

        });
        cb.onEndElementNS(function(elem, prefix, uri) {

            if (elem == 'en-note') {
                //       writer.endElement(); //body
                //       writer.endElement(); //html
            } else if (elem == 'en-todo') {

            } else if (elem == 'en-media') {
                if (mediaTagStarted) {
                    writer.endElement(); // source
                    writer.endElement(); // audio or video
                    writer.writeElement('br', '');
                    mediaTagStarted = false;

                } else if (linkTagStarted) {
                    writer.text(linkTitle);
                    writer.endElement(); // a
                    linkTagStarted = false;

                } else {
                    writer.endElement();
                }

            } else {

                writer.endElement();
            }
        });
        cb.onCharacters(function(chars) {
            writer.text(chars);
        });

    });

    parser.parseString(text);
    return writer.toString();

}


exports.getSearchNotes = function(req, res) {
    var errors = [];
    var notesColls = {};
    //console.log(req.body);
    var skipSearchIndex = req.body.params.skipSearchIndex;
    var nPerPage = req.body.params.pageSize;
    var pageNumber = req.body.params.page + 1;
    var queryParams = getSearchQueryParams(req);
    var sortParams = {updatedOn: -1};
    if (req.body.params.sort && req.body.params.sort != '') {
        if (req.body.params.sort == 'title') {
            sortParams = {title: 1};
        } else if (req.body.params.sort == 'location') {
            sortParams = {'location.lecture': 1};
        }
    }
    promise_lib.resolve()
        .then(function() {
            var defer = promise_lib.defer();
            NoteModel = mongoose.model('NoteModel');
            NoteModel.count(queryParams).exec(function(err, noteCount) {
                console.log("Total number of notes : " + noteCount);
                if (err) {
                    defer.reject(err);
                } else {
                    notesColls["totalNotes"] = noteCount;
                    defer.resolve();
                }
            });
            return defer.promise;
        })
        .then(function() {
            var defer = promise_lib.defer();
            NoteModel = mongoose.model('NoteModel');
            NoteModel.find(queryParams).skip(skipSearchIndex * appConfig.DEFAULT_RESULT_SIZE).limit(appConfig.DEFAULT_RESULT_SIZE).sort(sortParams).exec(function(err, notes) {
                console.log("Number of notes found : " + notes.length);
                /*to show/hide show more option*/
                if (notes.length < appConfig.DEFAULT_RESULT_SIZE || notes == null || !notes) notesColls['showMore'] = false;
                else notesColls['showMore'] = true;
                if (err) {
                    defer.reject(err);
                } else {
                    notesColls["notes"] = notes;
                    defer.resolve();
                }
            });
            return defer.promise;
        })
        .catch(function(err) {
            if (err) errors = err;
        })
        .done(function() {
            if (errors.length > 0) {
                console.log("Error cacheing searches: " + err);
                res.send("Update cache failed:" + err);
            } else {
                res.send(notesColls);
            }
        });
};


function getSearchQueryParams(req) {
    var keyword = req.body.params.keyword;
    var courseId = req.body.params.courseId;
    var contextId = req.body.params.contextId;
    var createdAfter = req.body.params.createdAfter;

    var queryParams = {};
    queryParams['learnerId'] = req.user.identifier;

    if (courseId != "" && courseId != undefined) {
        if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
            courseId = PlayerUtil.addFedoraPrefix(courseId);
        }
        queryParams['courseId'] = courseId;
    }

    if (typeof keyword == 'string' && keyword.trim() != '') {
        queryParams.$or = [];
        queryParams.$or.push({
            title: {
                $regex: keyword
            }
        });
        queryParams.$or.push({
            content: {
                $regex: keyword
            }
        });
    }

    if (contextId != "" && contextId != undefined) {
        if (contextId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
            contextId = PlayerUtil.addFedoraPrefix(contextId);
        }
        queryParams['elementId'] = contextId;
    }

    // date filter
    if (createdAfter != "" && createdAfter != undefined) {
        try {
            var timestamp = new Date(createdAfter);
            if (timestamp) {
                queryParams['_id'] = {
                    $gt: objectIdWithTimestamp(timestamp)
                };      
            }
        } catch(e) {
            console.log('timestamp error: ' + e);
        }
    }

    return queryParams;
};

function objectIdWithTimestamp(timestamp) {
    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp.getTime() / 1000).toString(16);
    // Create an ObjectId with that hex timestamp
    var constructedObjectId = mongoose.Types.ObjectId(hexSeconds + "0000000000000000");
    return constructedObjectId;
};
