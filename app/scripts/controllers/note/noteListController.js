angular.module('playerApp').controller('NoteListCtrl', function($rootScope, noteService, config, $window, $timeout, $state, $stateParams) {

    var noteList = this;
    noteList.userId = $window.localStorage.getItem('user') ? JSON.parse($window.localStorage.getItem('user')).userId : $rootScope.userId;
    noteList.courseId = $stateParams.courseId;
    noteList.contentId = $stateParams.contentId;
    noteList.add = {};
    noteList.update = {};
    noteList.update.showUpdateNote = false;
    noteList.add.showCreateNote = false;
    noteList.notesList = [];
    
    /**
     * This function helps to show loader or any error message at the time of api call.
     * @param {Boolean} showMetaLoader
     * @param {String} messageClass
     * @param {String} message
     */
    function showLoaderWithMessage(showMetaLoader, messageClass, message) {
        var error = {};
        error.showError = true;
        error.showMetaLoader = showMetaLoader;
        error.messageClass = messageClass;
        error.message = message;
        noteList.error = error;
    }

    /**
     * This function called when api failed, and its show failed response for 2 sec.
     * @param {String} message
     */
    function handleFailedResponse(message) {
        showLoaderWithMessage(false, "red", message);
        $timeout(function() {
            noteList.error = {};
        }, 2000);
    }

    /**
     * This function call search api and bind data
     * @param {type} request
     * @returns {undefined}
     */
    function search(request) {
        noteService.search(request).then(function(response) {
                if (response && response.responseCode === "OK") {
                    noteList.error = {};
                    noteList.notesList = response.result.note;
                } else {
                    handleFailedResponse(config.MESSAGES.NOTES.SEARCH.FAILED);
                }
            })
            .catch(function(error) {
                handleFailedResponse(config.MESSAGES.NOTES.SEARCH.FAILED);
            });
    }

    /**
     * This function called on ng-init(), 
     * This function help to fetch the user notes.
     */
    noteList.ngInit = function() {
        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.SEARCH.START);
        var request = {
            filters: {
                userId: noteList.userId,
                courseId: noteList.courseId,
                contentId: noteList.contentId
            },
            sort_by: {
                "lastUpdatedOn": "desc"
            }
        };
        search(request);
    };

    /**
     * This function helps to create note
     * @param {Object} noteData
     */
    noteList.createNote = function(noteData) {

        var requestData = {
            note: {
                note: noteData.note,
                userId: noteList.userId,
                title: noteData.title,
                courseId: noteList.courseId,
                contentId: noteList.contentId
            }
        };

        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.CREATE.START);
        noteService.create(requestData).then(function(response) {
            if (response && response.responseCode === "OK") {
                noteList.notesList.push(response.result.note);
                noteList.error = {};
                noteList.add = {};
            } else {
                handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
            }
        }).catch(function(error) {
            handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
        });
    };

    /**
     * This function helps to create note
     * @param {Object} noteId
     */
    noteList.removeNote = function(noteId) {

        var requestData = { noteId: noteId };

        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.REMOVE.START);
        noteService.remove(requestData).then(function(response) {
                if (response && response.responseCode === "OK") {
                    noteList.notesList = noteList.notesList.filter(function(note) {
                        return note.identifier !== noteId;
                    });
                    noteList.error = {};
                } else {
                    handleFailedResponse(config.MESSAGES.NOTES.REMOVE.FAILED);
                }
            })
            .catch(function(error) {
                handleFailedResponse(config.MESSAGES.NOTES.REMOVE.FAILED);
            });
    };

    /**
     * This function helps to update note
     * @param {Object} noteData
     */
    noteList.updateNote = function(noteData) {

        var requestData = {
            noteId: noteData.identifier,
            note: noteData
        };

        delete requestData.note['identifier'];

        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.UPDATE.START);
        noteService.update(requestData).then(function(response) {
                if (response && response.responseCode === "OK") {
                    noteList.notesList = noteList.notesList.filter(function(note) {
                        return note.identifier !== noteData.identifier;
                    });
                    noteList.notesList.push(response.result.note);
                    noteList.update = {};
                    noteList.error = {};
                } else {
                    noteList.showModalError = true;
                    handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
                }
            })
            .catch(function(error) {
                noteList.showModalError = true;
                handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
            });
    };

    /**
     * This function helps to search note
     * @param {String} searchText
     */
    noteList.searchNote = function(searchText) {
        var request = {
            query: searchText,
            filters: {
                userId: userId,
                courseId: noteList.courseId,
                contentId: noteList.contentId
            },
            sort_by: {
                "lastUpdatedOn": "desc"
            }
        };
        search(request);
    };
    
    noteList.closeNoteList = function () {
        
        if(noteList.courseId && noteList.contentId) {
            var params = {courseId: noteList.courseId, contentId: noteList.contentId};
            $state.go('CourseContentNote',params);
        } else if (noteList.courseId) {
            var params = {courseId: noteList.courseId};
            $state.go('CourseNote',params);
        } else if (noteList.contentId) {
            var params = {contentId: noteList.contentId};
            $state.go('ContentNote',params);
        }
        
    };
    
});
