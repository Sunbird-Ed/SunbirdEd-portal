app.controller('NotesBrowserCtrl', function($scope, $http, $location, $compile) {

    $scope.environment = 'Notes';

    $scope.loadNotesBrowser = function() {
        $http.get('/private/v1/notesBrowser/').success(function(notesBrowser) {
            $scope.notesBrowser = notesBrowser;
            $scope.setLists();
            var courseId = $scope.courses[0].id;
            $location.path('/notes/' + courseId + '/' + courseId + '/' + $scope.courses[0].type + '/' + $scope.courses[0].parentId);
            $scope.selectElement(courseId);
        });

    };

    $scope.setLists = function() {
        var courses = [];
        for (var courseId in $scope.notesBrowser.courseMap) {
            courses.push($scope.notesBrowser.courseMap[courseId]);
        }
        $scope.courses = courses;

        var modules = [];
        for (var moduleId in $scope.notesBrowser.moduleMap) {
            modules.push($scope.notesBrowser.moduleMap[moduleId]);
        }
        $scope.modules = modules;

        var lessons = [];
        for (var lessonId in $scope.notesBrowser.lessonMap) {
            lessons.push($scope.notesBrowser.lessonMap[lessonId]);
        }
        $scope.lessons = lessons;

        var lectures = [];
        for (var lectureId in $scope.notesBrowser.lectureMap) {
            lectures.push($scope.notesBrowser.lectureMap[lectureId]);
        }
        $scope.lectures = lectures;
    };

    $scope.showHideScrollButtons = function(element, level) {
        if (level == 0) {
            $scope.showLevel0 = true;
            if (element.sequence && element.sequence.length > 0) {
                $scope.showLevel1 = true;
            } else {
                $scope.showLevel1 = false;
            }
            var lessons = $scope.lessons;
            var enableLevel2 = false;
            if (lessons && lessons.length > 0) {
                for (var i = 0; i < lessons.length; i++) {
                    var les = lessons[i];
                    if (les.courseId && les.courseId == element.id) {
                        enableLevel2 = true;
                        break;
                    }
                }
            }
            $scope.showLevel2 = enableLevel2;
            var lectures = $scope.lectures;
            var enableLevel3 = false;
            if (lectures && lectures.length > 0) {
                for (var i = 0; i < lectures.length; i++) {
                    var lec = lectures[i];
                    if (lec.courseId && lec.courseId == element.id) {
                        enableLevel3 = true;
                        break;
                    }
                }
            }
            $scope.showLevel3 = enableLevel3;
        } else if (level == 1) {
            $scope.showLevel0 = true;
            $scope.showLevel1 = true;
            if (element.sequence && element.sequence.length > 0) {
                $scope.showLevel2 = true;
            } else {
                $scope.showLevel2 = false;
            }
            var lectures = $scope.lectures;
            var enableLevel3 = false;
            if (lectures && lectures.length > 0) {
                for (var i = 0; i < lectures.length; i++) {
                    var lec = lectures[i];
                    if (lec.moduleId && lec.moduleId == element.id) {
                        enableLevel3 = true;
                        break;
                    }
                }
            }
            $scope.showLevel3 = enableLevel3;
        } else if (level == 2) {
            $scope.showLevel0 = true;
            $scope.showLevel1 = true;
            $scope.showLevel2 = true;
            if (element.sequence && element.sequence.length > 0) {
                $scope.showLevel3 = true;
            } else {
                $scope.showLevel3 = false;
            }
        } else if (level == 3) {
            $scope.showLevel0 = true;
            $scope.showLevel1 = true;
            $scope.showLevel2 = true;
            $scope.showLevel3 = true;
        }
    };

    $scope.selectElement = function(elementId) {
        var element = $scope.getElementFromMap(elementId);
        $scope.tocParentId = '';
        if (element) {
            $scope.showHideScrollButtons(element, element.level);
            var currentItem = {};
            currentItem.id = elementId;
            currentItem.level = element.level;
            currentItem.parentId = element.parentId;
            $scope.currentItem = currentItem;
            $scope.scrollSlide(element.level);
        } else {
            $scope.currentItem = {};
            $scope.selectedCourse = '0';
            $scope.selectedModule = '0';
            $scope.selectedLesson = '0';
            $scope.showLevel0 = true;
            $scope.showLevel1 = false;
            $scope.showLevel2 = false;
            $scope.showLevel3 = false;
        }
    };

    $scope.scrollSlide = function(level) {
        $scope.level = level;
        var currentItem = $scope.currentItem;
        var module;
        var lesson;
        var lecture;
        var course;
        var currLevel = -1;
        if (currentItem && currentItem.id && currentItem.id != '') {
            currLevel = currentItem.level;
            if (currLevel == 0) {
                course = $scope.getElement(currentItem.id, 0);
            } else if (currLevel == 1) {
                module = $scope.getElement(currentItem.id, 1);
                course = $scope.getElement(module.parentId, 0);
            } else if (currLevel == 2) {
                lesson = $scope.getElement(currentItem.id, 2);
                module = $scope.getElement(lesson.parentId, 1);
                course = $scope.getElement(module.parentId, 0);
            } else if (currLevel == 3) {
                lecture = $scope.getElement(currentItem.id, 3);
                lesson = $scope.getElement(lecture.parentId, 2);
                module = $scope.getElement(lesson.parentId, 1);
                course = $scope.getElement(module.parentId, 0);
            }
            if (typeof course == 'undefined' || !course) {
                for (var id in $scope.notesBrowser.courseMap) {
                    course = $scope.notesBrowser.courseMap[id];
                    break;
                }
            }
            if (level > 0 && (typeof module == 'undefined' || !module)) {
                var moduleId = course.sequence[0];
                module = $scope.getElement(moduleId, 1);
            }
            if (level > 1 && (typeof lesson == 'undefined' || !lesson)) {
                var lessonId = module.sequence[0];
                lesson = $scope.getElement(lessonId, 2);
            }
            if (level > 2 && (typeof lecture == 'undefined' || !lecture)) {
                var lectureId = lesson.sequence[0];
                lecture = $scope.getElement(lectureId, 3);
            }
            if (currLevel != -1 && currLevel < level) {
                //$scope.selectFirstElement(level, course, module, lesson, lecture);
            }
            $scope.selectedCourse = course.id;
            if (module) {
                $scope.selectedModule = module.id;
            }
            if (lesson) {
                $scope.selectedLesson = lesson.id;
            }

            if (level == 0) {
                for (var courseId in $scope.notesBrowser.courseMap) {
                    var courseEle = $scope.notesBrowser.courseMap[courseId];
                    if (currLevel > 0 && courseId == course.id) {
                        $scope.tocParentId = courseId;
                        break;
                    }
                }
            } else if (level == 1) {
                var modules = $scope.getChildren(course.id, 0);
                if (modules && modules.length > 0) {
                    for (var i = 0; i < modules.length; i++) {
                        var moduleEle = modules[i];
                        if (currLevel > 1 && moduleEle.id == module.id) {
                            $scope.tocParentId = moduleEle.id;
                            break;
                        }
                    }
                }
            } else if (level == 2) {
                var lessons = $scope.getChildren(module.id, 1);
                if (lessons && lessons.length > 0) {
                    for (var i = 0; i < lessons.length; i++) {
                        var lessonEle = lessons[i];
                        if (currLevel > 1 && lessonEle.id == lesson.id) {
                            $scope.tocParentId = lessonEle.id;
                            break;
                        }
                    }
                }
            }
        }
        $('.tocPagination a').removeClass('active');
        $('#slide' + level).addClass('active');
        $scope.setParentElement(level);
        setTimeout(function() {
            adjustTOCHeight();
            $('.tocCarousel').jcarousel('scroll', level, true);
        }, 200);
    };

    $scope.setParentElement = function(level) {
        if (level > 0) {
            var currentItem = $scope.currentItem;
            if (currentItem && currentItem.id && currentItem.id != '') {
                var parentLevel = currentItem.level - 1;
                var parentId = currentItem.parentId;
                if (currentItem.level < level) {
                    parentId = currentItem.id;
                    parentLevel = currentItem.level;
                }
                var parent = $scope.getElement(parentId, parentLevel);
                if (parent) {
                    if (parent.level > level) {
                        var obj = $scope.getElement(parent.parentId, parent.level - 1);
                        parent = $scope.getElement(obj.parentId, obj.level - 1);
                    } else if (parent.level > (level - 1)) {
                        parent = $scope.getElement(parent.parentId, parent.level - 1);
                    }
                }
                $scope.currentItem.parent = parent;
            }
        } else {
            $scope.currentItem.parent = {};
        }
    };

    $scope.loadNotesBrowser();

    $scope.selectFirstElement = function(level, course, module, lesson, lecture) {
        var element;
        if (level == 0) {
            element = course;
        } else if (level == 1) {
            element = module;
        } else if (level == 2) {
            element = lesson;
        } else if (level == 3) {
            element = lecture;
        }
        if (typeof element != 'undefined' && element) {
            $location.path('/notes/' + element.courseId + "/" + element.id + "/" + element.type + "/" + element.parentId);
            $scope.selectElement(element.id);
        }
    };

    $scope.getElementFromMap = function(elementId) {
        var element;
        if ($scope.notesBrowser.courseMap[elementId]) {
            element = $scope.notesBrowser.courseMap[elementId];
        } else if ($scope.notesBrowser.moduleMap[elementId]) {
            element = $scope.notesBrowser.moduleMap[elementId];
        } else if ($scope.notesBrowser.lessonMap[elementId]) {
            element = $scope.notesBrowser.lessonMap[elementId];
        } else if ($scope.notesBrowser.lectureMap[elementId]) {
            element = $scope.notesBrowser.lectureMap[elementId];
        }
        return element;
    }

    $scope.getElement = function(elementId, level) {
        var element;
        if (level == 0) {
            element = $scope.notesBrowser.courseMap[elementId];
        } else if (level == 1) {
            element = $scope.notesBrowser.moduleMap[elementId];
        } else if (level == 2) {
            element = $scope.notesBrowser.lessonMap[elementId];
        } else if (level == 3) {
            element = $scope.notesBrowser.lectureMap[elementId];
        }
        return element;
    };

    $scope.getChildren = function(id, level) {
        var element = $scope.getElement(id, level);
        var children = [];
        if (element) {
            if (element.sequence && element.sequence.length > 0) {
                for (var i = 0; i < element.sequence.length; i++) {
                    var child = $scope.getElement(element.sequence[i], level + 1);
                    if (child) {
                        children.push(child);
                    }
                }
            }
        }
        return children;
    };

});

var m_names = new Array("January", "February", "March",
    "April", "May", "June", "July", "August", "September",
    "October", "November", "December");

app.controller('NotesCtrl', function($scope, $stateParams, $http, $location, $compile, $sce, $rootScope, $state, CourseBrowserService) {

    $scope.allLectures = CourseBrowserService.serializedTOC;
    $scope.newNote = {
        title: undefined,
        description: undefined
    };
    $scope.environment = 'Notes';
    $scope.editedNote = '1';
    $scope.clickedNote = '1';
    $scope.showAddNote = false;
    $scope.count = 0;
    $scope.everNoteView = '0';
    var type = 'course'; //$stateParams.type;
    var courseId = CourseBrowserService.removeFedoraPrefix($rootScope.courseId);
    var elementId = $stateParams.elementId;
    var parentId = $stateParams.parentId;
    var noteId = '';
    var skipSearchIndex = 0;
    var skipNoteIndex = 0;
    $scope.notesList = [];
    $scope.hasMore = false;
    $scope.sortFilter = 'updatedOn';
    $scope.showMoreLoading = false;
    $scope.search = {};

    $scope.notesSearchList = [];
    $scope.sortNotes = function(sortField) {
        $scope.sortFilter = sortField;
        $scope.getSearchNotes();
    };

    $scope.getSearchNotes = function(showMore) {
        // $scope.checkFilters();
        $scope.loadingNotes = false;
        if (showMore != undefined) {
            skipSearchIndex += 1;
            $scope.showMoreLoading = true;
        }
        var contextId;
        if ($scope.search.context) {
            contextId = $scope.search.context.id;
        }
        $('#searchNoteBtn').html('Searching...').attr('disabled', true);
        $scope.reqParams = {
            "skipSearchIndex": skipSearchIndex,
            "courseId": $rootScope.courseId,
            "keyword": $scope.search.searchtext,
            "contextId": contextId,
            "createdAfter": $scope.search.fromDate,
            "sort": $scope.sortFilter
        };

        $http.post('/private/v1/note/searchNotes/', {
            params: $scope.reqParams
        }).success(function(data) {
            $('#searchNoteBtn').html('Search').attr('disabled', false);
            $scope.showMoreLoading = false;
            if (data.showMore == true) $scope.hasMoreNotes = true;
            else $scope.hasMoreNotes = false;

            if (showMore != undefined) {
                $scope.notesList.push.apply($scope.notesList, data.notes);
            } else {
                $scope.notesList = data.notes;
            }

            $scope.totalNotes = data.totalNotes;
            if ($scope.totalNotes == 0) $scope.setNoContentFoundMsg = true;
        }).
        error(function(data, status, headers, config) {
            $('#searchNoteBtn').html('Search').attr('disabled', false);
        });
    };

    $scope.getNotesList = function(showMore) {
        $scope.isDetailView = false;
        $scope.courseId = courseId;
        $scope.elementId = elementId;
        $scope.type = type;
        $scope.parentId = parentId;
        $scope.authorised = "";

        if (!$scope.search.context && elementId) {
            $scope.search.context = {id: elementId};
        }
        $scope.getSearchNotes(showMore);
    };

    $scope.getNote = function(noteId) {
        $http.get('/private/v1/note/' + noteId).success(function(data) {
            $scope.isDetailView = true;
            $scope.isEditable = false;
            $scope.editableNote = data;
            $scope.editableNote.content = toMarkdown(data.content);
        });
    };

    $scope.setResponseValues = function(data) {
        //$scope.notesList = data.noteList;
        $scope.notesList.push.apply($scope.notesList, data.noteList);
        $scope.courseName = data.course;
        $scope.elementName = data.element;
        $scope.authorised = data.authorise;
        $scope.lastAccessedDate = data.lastAccessedOn;
        $scope.lastSyncedDate = data.lastSyncedOn;
    };

    $scope.addNewNote = function() {
        if ($scope.everNoteView == 1) {
            $(".evernote-btns").slideToggle('slow');
            $scope.everNoteView = 0;    
        }
        if ($scope.showSearchForm) {
            $('#noteSearchForm').slideToggle('slow');
            $scope.showSearchForm = false;
        }
        $scope.newNote.title = '';
        $scope.newNote.description = '';
        $('.evernote').removeClass('fa-close');
        $('.evernote').addClass('evernote-icon');
        $('.createNote').toggleClass('fa-edit');
        $('.createNote').toggleClass('fa-close');
        $('.searchNote').removeClass('fa-close');
        $('.searchNote').addClass('fa-toggle-down');
        $scope.showAddNote = !$scope.showAddNote;
        $(".AskQEdit").slideToggle('slow');
    };

    $scope.setTab = function(inputId, descDiv) {
        $('#' + inputId).keydown(function(e) {
            if (e.which == 9) {
                $('#' + descDiv + ' div[id^="taTextElement"]').focus();
                e.preventDefault();
            }
        });
    };

    $scope.createNote = function() {
        if (($scope.newNote.title != null && $scope.newNote.title != "" && $scope.newNote.title != undefined) && ($scope.newNote.description != null && $scope.newNote.description != "" && $scope.newNote.description != undefined)) {
            var strLocation = '';
            var href = '';
            var urlToBeSaved = '';
            if ($scope.type) {
                strLocation = '<br/><br/>Note Location: <a href="';
                var cid = encodeURIComponent('info:fedora/' + $scope.courseId);
                href = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/private/player/course/' + cid;
                if ($scope.type == 'course') {
                    // do nothing
                } else if ($scope.type == 'module' || $scope.type == 'lesson') {
                    href += '#/browser/' + $scope.elementId;
                } else {
                    href += '#/play/' + $scope.parentId + "/" + $scope.elementId;
                }
                strLocation += href + '">';
                if ($scope.elementName) {
                    strLocation += $scope.elementName;
                } else {
                    strLocation += $scope.courseName;
                }
                strLocation += '</a>';
            }
            urlToBeSaved = href;

            $http.post('/private/v1/note/', {
                title: $scope.newNote.title,
                content: $scope.newNote.description,
                url: urlToBeSaved,
                location: {
                    course: $scope.courseName,
                    lecture: $scope.elementName
                },
                tags: ['Course: ' + $scope.courseName],
                courseId: $scope.courseId,
                elementId: $scope.elementId
            }).success(function(data) {
                $scope.showAddNote = false;
                $('.createNote').toggleClass('fa-close');
                $('.createNote').toggleClass('fa-edit');
                $(".AskQEdit").slideUp('slow');
                if (!$scope.notesList) {
                    $scope.notesList = [];
                }
                $scope.notesList.splice(0, 0, data);
            });
        }
    };

    $scope.cancelCreateNote = function() {
        $scope.showAddNote = false;
    };

    $scope.displayNote = function(id) {
        if ($scope.clickedNote == id)
            $scope.clickedNote = '1';
        else
            $scope.clickedNote = id;
    };

    $scope.hideNote = function() {
        $scope.clickedNote = '1';
    };
    $scope.showNoteFullView = function(note) {
        $state.go('note', {
            noteId: note.identifier
        });
    };

    $scope.cancelEditNote = function() {
        $scope.isEditable = false;
        $scope.updateIcons();
    };

    $scope.saveNote = function(id) {
        $scope.objectId = id;
        var note = $scope.editableNote;
        if (note) {
            if ((note.title != null && note.title != "") && (note.content != null && note.content != "")) {
                var cid = encodeURIComponent('info:fedora/' + $scope.courseId);
                href = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/private/player/course/' + cid;
                if ($scope.type == 'course') {
                    $scope.updateIcons();
                } else if ($scope.type == 'module' || $scope.type == 'lesson') {
                    href += '#/browser/' + $scope.elementId;
                } else {
                    href += '#/play/' + $scope.parentId + "/" + $scope.elementId;
                }
                note.url = href;
                $http.post('/private/v1/note/', note).success(function(data) {
                    $scope.editedNote = '1';
                    $scope.clickedNote = '1';
                    $scope.isEditable = false;
                    $("#notesAlert").removeClass("hide").addClass("alert-success").html("Notes Updated. Redirecting to notes list...");
                    setTimeout(function() {
                        $("#notesAlert").addClass("hide").removeClass("alert-success").html("");
                        $scope.backToList();
                    }, 2000);
                });
            }
        }
    };

    $scope.noteToDelete = undefined;

    $scope.confirmDeleteNote = function(note) {
        $scope.noteToDelete = note;
        $('#noteDeleteModal').modal('show');
    }

    $scope.deleteNote = function() {
        $scope.objectId = $scope.noteToDelete.identifier;
        var list = $scope.notesList;
        if (list && list.length > 0) {
            var note;
            var index;
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                if (obj.identifier == $scope.noteToDelete.identifier) {
                    index = i;
                    note = obj;
                    break;
                }
            }
            if (note) {
                $http.delete('/private/v1/note/' + note.identifier).success(function(data) {
                    $scope.notesList.splice(index, 1);
                    $scope.noteToDelete = undefined;
                    $('#noteDeleteModal').modal('hide');
                });
            }
        }
    };

    $scope.renderHtml = function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.renderHtmlTrim = function(htmlCode, length) {
        var subtxt = htmlCode.substring(0, length);
        if (htmlCode.length > length) {
            subtxt = subtxt + '...';
        }
        var txt = $sce.trustAsHtml(subtxt);
        return txt;
    };

    $scope.formatDate = function(dt) {
        var d = new Date(dt);
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();
        var str = curr_date + "-" + m_names[curr_month] + "-" + curr_year;
        return str;
    }

    $scope.clearNewNote = function() {
        $scope.newNote.title = '';
        $scope.newNote.description = '';
    }

    $scope.backToList = function() {
        $scope.isDetailView = false;
        $state.go('notes', {});
    }

    $scope.editNote = function(note) {
        $scope.updateIcons();
        if ($scope.isEditable) {
            $scope.isEditable = false;
        } else {
            $scope.isEditable = true;
        }
        $scope.editableNote = note;
    }

    $scope.showEverNote = function() {
        $scope.showSearchForm = false;
        if ($scope.showAddNote) {
            $(".AskQEdit").slideToggle('slow');
            $scope.showAddNote = false;
        }
        if ($scope.showSearchForm) {
            $('#noteSearchForm').slideToggle('slow');
            $scope.showSearchForm = false;
        }
        if ($scope.everNoteView == 1) {
            $scope.everNoteView = 0;
        } else {
            $scope.everNoteView = 1;
        }
        $(".evernote-btns").slideToggle('slow');
        $('.evernote').toggleClass('fa-close');
        $('.evernote').toggleClass('evernote-icon');
        $('.createNote').removeClass('fa-close');
        $('.createNote').addClass('fa-edit');
        $('.searchNote').removeClass('fa-close');
        $('.searchNote').addClass('fa-toggle-down');
    }

    $scope.updateIcons = function() {
        $('.updateNote').toggleClass('fa-close');
        $('.updateNote').toggleClass('fa-edit');
    }

    $scope.goToLob = function(note) {
        var elementId = note.elementId;
        var courseId = note.courseId;
        if (elementId) {
            $state.go('cb', {
                lobId: elementId
            });
        } else if (courseId) {
            navigateTo('/private/player/course/', courseId);
        }
    }

    $scope.addNoteFromPie = function() {
        setTimeout(function() {
            $('.createNote').addClass('fa-close');
            $('.createNote').removeClass('fa-edit');
            $(".AskQEdit").slideDown('fast');
        }, 500);
        $scope.showAddNote = true;
    }

    if ($rootScope.NotesViewFromPie) {
        $scope.addNoteFromPie();
    }

    var noteId = $stateParams.noteId;
    if (noteId && noteId != '') {
        $scope.getNote(noteId);
    } else {
        $scope.loadingNotes = true;
        $scope.getNotesList();
    }

    $scope.note = {};
    $scope.showSearchForm = false;
    $scope.searchNoteForm = function() {
        if ($scope.showAddNote) {
            $(".AskQEdit").slideToggle('slow');
            $scope.showAddNote = false;
        }
        if ($scope.everNoteView == '1') {
            $(".evernote-btns").slideToggle('slow');
            $scope.everNoteView = '0';    
        }
        $('.evernote').removeClass('fa-close');
        $('.evernote').addClass('evernote-icon');
        $('.createNote').removeClass('fa-close');
        $('.createNote').addClass('fa-edit');
        $('.searchNote').toggleClass('fa-toggle-down');
        $('.searchNote').toggleClass('fa-close');
        $('#noteSearchForm').slideToggle('slow');
        $scope.showSearchForm = !$scope.showSearchForm;
    }

    $scope.initializeSelect2 = function() {
        setTimeout(function() {
            $("#lectureSelect").select2({
                formatResult: function(state) {
                    return state.text;
                },
                placeholder: "Select Lectures...",
                formatSelection: function(state) {
                    return state.text.replace(/&emsp;/g, '');
                },
                allowClear: true,
                escapeMarkup: function(m) { return m; }
            });
        }, 100);
    }

    $scope.initializeSelect2();
    // Date picker
    $scope.datepicker = {
        fromOpened: false,
        toOpened: false,
        dateOptions: {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks: false
        }
    }
    $scope.open = function($event, type) {
        $event.preventDefault();
        $event.stopPropagation();
        if (type == 'from') $scope.datepicker.fromOpened = true;
    };

    $scope.disableKeyDown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
    }

    $scope.clearContextInput = function() {
        contextSearchPrevValue = '';
        $(document).ready(function() {
            $('.bindercontextselect').click(function(evt) {
                evt.stopPropagation();
                $(".qa-context-container").toggleClass("qa-context-container-hover");
                $('.bindercontextselect').val('');
            });
            $(document).click(function() {
                $('.qa-context-container').removeClass('qa-context-container-hover'); //make all inactive
                if ($('.bindercontextselect').val() == '') {
                    $('.bindercontextselect').val(contextSearchPrevValue);
                }
            });
        });

        contextSearchPrevValue = $('.bindercontextselect').val();
        $scope.note.parent = '';
    }

    $scope.setNoteContext = function(context) {
        $scope.note.parent = context;
        $scope.note.parentId = context.id;
    }

    $scope.clearSearchFilters = function() {
        $scope.search.context = undefined;
        $scope.search.searchtext = undefined;
        $scope.search.fromDate = undefined;
        $("#lectureSelect").select2("data", null);
        $scope.getSearchNotes();
    }

});
