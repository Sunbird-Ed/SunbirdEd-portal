/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Defines all Rest Routes. This is a framework component that can be used to
 * configure deployable services at runtime from thei orchestrator. This can
 * also provide authentication, interceptor capabilities.
 *
 * @author ravitejagarlapati
 */
var promise_lib = require('when');
var RBACUtil = require('../commons/RBACUtil');
var CSVImportUtil = require('../commons/CSVImportUtil');
var fs = require('fs');
var taxonomyViewHelper = require('../view_helpers/studio/TaxonomyViewHelper');
var pedagogyViewHelper = require('../view_helpers/studio/PedagogyViewHelper');
var courseViewHelper = require('../view_helpers/studio/CourseViewHelper');
var conceptViewHelper = require('../view_helpers/studio/ConceptViewHelper');
var lobViewHelper = require('../view_helpers/studio/LearningObjectViewHelper');
var lrViewHelper = require('../view_helpers/studio/LearningResourceViewHelper');
var laViewHelper = require('../view_helpers/studio/LearningActivityViewHelper');
var contentViewHelper = require('../view_helpers/studio/ContentViewHelper');
var courseImporter = require('../view_helpers/studio/CourseImportHelper');
var courseExporter = require('../view_helpers/studio/CourseExportHelper');
var dashboardViewHelper = require('../view_helpers/player/DashboardViewHelper');
var playerViewHelper = require('../view_helpers/player/PlayerViewHelper');
var quizViewHelper = require('../view_helpers/player/QuizViewHelper');
var programViewHelper = require('../view_helpers/player/ProgramViewHelper');
var learnerStateHelper = require('../view_helpers/player/LearnerStateHelper');
var testDataBuilder = require('../view_helpers/player/TestDataBuilder');
var additionalMaterialHelper = require('../view_helpers/player/AdditionalMaterialHelper');
var learnerEnrollmentHelper = require('../view_helpers/player/LearnerEnrollmentHelper');
var contentUtil = require('../view_helpers/player/ContentUtil');
var noteViewHelper = require('../view_helpers/NoteViewHelper');
var userViewHelper = require('../view_helpers/UserViewHelper');
var mediaUtil = require('../commons/MediaHelper');
var instructorViewHelper = require('../view_helpers/InstructorViewHelper');
var playerLearningObjectiveHelper = require('../view_helpers/player/LearningObjectiveViewHelper');
var courseMWViewHelper = require('../view_helpers/studio/CourseMWViewHelper');
var studioLearningObjectiveViewHelper = require('../view_helpers/studio/LearningObjectiveViewHelper');
var roleViewHelper = require('../view_helpers/RoleViewHelper');
var studentViewHelper = require('../view_helpers/StudentViewHelper');
var userImporter = require('../view_helpers/UserImportHelper');
var CSVImportUtil = require('../commons/CSVImportUtil');
var learnerMiddlewareViewHelper = require('../view_helpers/LearnerMiddlewareViewHelper');
var learnerSearchVH = require('../view_helpers/player/LearnerSearchViewHelper');
var assessmentViewHelper = require('../view_helpers/player/AssessmentViewHelper');
var logStreamHelper = require('../log_stream/view_helpers/LogStreamHelper');
var coachingViewHelper = require('../coaching/view_helpers/CoachingViewHelper');
var contentSearchViewHelper = require('../view_helpers/player/contentSearchViewHelper');
var enrollmentImportHelper = require('../view_helpers/EnrollmentImportHelper');
var assessmentViewHelper = require('../view_helpers/player/AssessmentViewHelper');
var manageCoachingViewHelper =  require('../view_helpers/player/ManageCoachingViewHelper');
var thirdpartyViewHelper = require('../view_helpers/studio/ThirdpartyViewHelper');
var adminViewHelper = require('../view_helpers/AdminViewHelper');
var assessmentsImportExportViewHelper = require('../view_helpers/AssessmentsImportExportViewHelper');
var courseDashboardViewHelper = require('../view_helpers/player/CourseDashboardViewHelper');
var studentDashboardViewHelper = require('../view_helpers/player/StudentDashboardViewHelper');
var idCacheUtil = require('../commons/IDCacheUtil');

// TODO ORCH add authentication, interceptors
module.exports = function(app, dirname, passport, connectroles) {

    app.all('/*', setUser);

    app.get('/', connectroles.can('public'), function(req, res) {
        res.render('web/homepage.ejs');
    });

    app.get('/home', connectroles.can('public'), function(req, res) {
        res.render('web/homepage.ejs');
    });

    app.post('/private/v1/login/', connectroles.can('public'), function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            console.log(err + "\n" + JSON.stringify(user) + "\n" + info);
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send({
                    status: 'failed',
                    message: 'User not Found'
                });
            }
            req.logIn(user, function(err) {
                console.log(err);
                if (err) {
                    return next(err);
                }
                return res.send({
                    status: 'success',
                    message: ''
                });
            });
        })(req, res, next);
    });


    // app.get('/v1/perfData', userViewHelper.createPerfData);

    app.get('/aboutus', connectroles.can('public'), function(req, res) {
        res.render('web/aboutus.ejs');
    });

    app.get('/ilimi-platform', connectroles.can('public'), function(req, res) {
        res.render('web/ilimi-platform.ejs');
    });
    

    app.get('/howitworks', connectroles.can('public'), function(req, res) {
        res.render('web/howitworks.ejs');
    });

    app.get('/people', connectroles.can('public'), function(req, res) {
        res.render('web/people.ejs');
    });

    app.get('/analytics', connectroles.can('public'), function(req, res) {
        res.render('web/analytics.ejs');
    });

    app.get('/classact', connectroles.can('public'), function(req, res) {
        res.render('web/classact.ejs');
    });

    app.get('/learningobjects', connectroles.can('public'), function(req, res) {
        res.render('web/LearningObjects.ejs');
    });

    app.get('/faq', connectroles.can('public'), function(req, res) {
        res.render('web/FAQ.ejs');
    });

    app.get('/termsofuse', connectroles.can('public'), function(req, res) {
        res.render('web/termsofuse.ejs');
    });

    app.get('/privacypolicy', connectroles.can('public'), function(req, res) {
        res.render('web/privacypolicy.ejs');
    });
    

    app.post('/v1/player/cache/clear/:courseId', connectroles.can('public'), function(req, res) {
        var courseId = req.params.courseId;
        ClusterHub.emit('event', {type: 'cache', action: 'clear', courseId: courseId});
        res.send('Cache clear event sent');
    });

    app.get('/register', connectroles.can('public'), function(req, res) {
        if(req.user && !req.user.registered) {
            res.render('web/register.ejs');
        } else {
            res.render('web/homepage.ejs');
        }
    });

    app.get('/private/v1/PDFDocs/:fileName', function (req, res) {
        fs.readFile(__dirname + '/../public/uploads/document/' + req.params.fileName, function (err, data) {
            res.contentType("text/html");
            res.send(data);
        });
    });

    app.post('/public/v1/sendRegisterMail', connectroles.can('public'), userViewHelper.sendRegisterMail);

    app.get('/course/:courseId', connectroles.can('public'), function(req, res) {
        res.locals.courseId = req.params.courseId;
        res.render('web/course.ejs');
    });

    app.get('/instructor/:instructorId', connectroles.can('public'), function(req, res) {
        res.locals.instructorId = req.params.instructorId;
        res.render('web/instructor.ejs');
    });

    app.get('/v1/player/appConfig', connectroles.can('public'), playerViewHelper.getAppConfig);
    app.get('/v1/player/getHomePageCourses', connectroles.can('public'), courseViewHelper.getHomePageCourses);
    app.get('/v1/player/getAnnouncementCourse/:courseId', connectroles.can('public'), courseViewHelper.getAnnouncementCourse);
    app.post('/v1/course/fetchSunburstConceptMap/', connectroles.can('public'), connectroles.can('public'), conceptViewHelper.fetchSunburstConceptMap);
    app.get('/v1/instructor/get/:instructorId', connectroles.can('public'), instructorViewHelper.getInstructor);
    app.get('/v1/instructor/course/:courseId', connectroles.can('public'), instructorViewHelper.getInstructors);
    app.get('/v1/content/getAllLearningObjectives', connectroles.can('public'), studioLearningObjectiveViewHelper.getAll);
    app.post('/private/v1/taxonomy/export/', connectroles.can('public'), taxonomyViewHelper.exportToJSON);

    app.post('/private/v1/performance/marker', connectroles.can('log_write'), logMarker);
    app.post('/private/v1/performance/jmeterlog', connectroles.can('log_write'), logJmeterLogs);

    app.get('/private/v1/loadAllPedagogies', pedagogyViewHelper.loadPedagogies);
    app.get('/private/v1/loadPOCData', pedagogyViewHelper.loadPOCData);
    app.get('/private/v1/registerMWCommands', connectroles.can('mwcommands_write'), pedagogyViewHelper.registerMWCommands);

    app.post('/private/v1/course/upload/image/', courseImporter.uploadImage);
    app.post('/private/v1/course/upload/json/', courseImporter.uploadJSON);
    app.post('/private/v1/course/upload/audio/', courseImporter.uploadAudio);
    app.post('/private/v1/course/upload/html/', courseImporter.uploadHtml);
    app.post('/private/v1/course/upload/text/', courseImporter.uploadText);
    app.post('/private/v1/course/upload/coursecontent/', courseImporter.uploadCourseContent);

    /** Delete Services - Start */
    app.post('/private/v1/service/delete/json', courseImporter.deleteObject);
    /** Delete Services - End */

    // All below will be private calls
    app.all('/private/*', isLoggedIn);
    app.all('/private/*', isAcceptedTAndC);


    /** Admin pages - Start */
    app.get('/private/admin/import', connectroles.can('command_admin'), function(req, res) {
        res.render('admin/import.ejs');
    });
    app.get('/private/admin/importqueue', CSVImportUtil.getImportQueue);
    app.get('/private/admin/importrecord/:queueRecordId', CSVImportUtil.getCSVImportQueueRecord);
    app.get('/private/admin/downloadcsv/:id', CSVImportUtil.downloadCSV);
    app.get('/private/admin/download/:id/originalFile', CSVImportUtil.downloadOriginal);
    app.post('/private/v1/user/import', connectroles.can('content_write'), userImporter.importUsersCSV);
    app.post('/private/v1/user/delete', connectroles.can('content_write'), userImporter.deleteUsersCSV);
    app.post('/private/v1/user/cleanup', connectroles.can('content_write'), userImporter.cleanupUsersCSV);
    app.post('/private/v1/course/import/', connectroles.can('content_write'), courseImporter.importCSV);
    app.post('/private/v1/service/delete/csv', connectroles.can('content_write'), courseImporter.deleteObjectsCSV);
    app.post('/private/v1/service/cleanup/csv', connectroles.can('content_write'), courseImporter.cleanupObjectsCSV);
    app.post('/private/v1/allCourses', connectroles.can('content_write'), courseViewHelper.getAllCourses);
    app.get('/private/v1/course/export/:id', connectroles.can('content_write'), courseExporter.exportCourseAsCSV);
    app.post('/private/v1/course/importConcepts/', connectroles.can('content_write'), courseImporter.importConceptCSV);
    app.post('/private/v1/enrollment/import', connectroles.can('content_write'), enrollmentImportHelper.importEnrollmentCSV);
    app.get('/private/v1/enrollment/syncPump/:skip/:limit', connectroles.can('content_write'), enrollmentImportHelper.syncPump);
    app.post('/private/v1/organization/upsert', connectroles.can('content_write'), adminViewHelper.upsertOrganization);
    app.post('/private/v1/organization/update', connectroles.can('content_write'), adminViewHelper.updateOrganization);
    /** Admin pages - End */

    app.post('/private/v1/role', connectroles.can('role_write'), roleViewHelper.saveRole);
    app.delete('/private/v1/role/:id', connectroles.can('role_delete'), roleViewHelper.delete);
    app.post('/private/v1/role/addaction', connectroles.can('role_write'), roleViewHelper.addActionToRole);
    app.post('/private/v1/role/removeaction', connectroles.can('role_write'), roleViewHelper.removeActionFromRole);
    app.get('/private/v1/role', connectroles.can('role_read'), roleViewHelper.findAll);
    app.get('/private/v1/action', connectroles.can('action_read'), roleViewHelper.findAllActions);
    app.get('/private/v1/usersbyrole/:role', connectroles.can('role_read'), userViewHelper.findByRole);
    app.post('/private/v1/user/removerole', connectroles.can('role_read'), userViewHelper.removeRoleFromUsers);
    app.post('/private/v1/user/addrole', connectroles.can('role_read'), userViewHelper.addRoleToUsers);
    app.post('/private/v1/user/profile', connectroles.can('public'), userViewHelper.saveUserProfile);
    app.get('/private/v1/user/:userId/profile', connectroles.can('public'), userViewHelper.getUserProfile);

    app.get('/private/v1/getcurrentuseractions', roleViewHelper.getCurrentUserActions);

    app.post('/private/v1/student', connectroles.can('student_write'), studentViewHelper.saveStudent);
    app.post('/private/v1/tutor', connectroles.can('instructor_write'), instructorViewHelper.saveTutor);
    app.get('/private/v1/tutor', connectroles.can('instructor_read'), instructorViewHelper.getTutor);
    app.post('/private/v1/tutor/assigncourse', connectroles.can('instructor_write'), instructorViewHelper.assignCourse);
    app.post('/private/v1/course/assignCoaches', learnerEnrollmentHelper.updateAllLearnerCoachAssignments);

    //Taxonomy View Helper
    app.get('/private/v1/taxonomy/', connectroles.can('taxonomy_read'), taxonomyViewHelper.findAll);
    app.get('/private/v1/taxonomy/load', connectroles.can('taxonomy_read'), taxonomyViewHelper.loadTaxonomies);
    app.get('/private/v1/taxonomy/metadata/:id', connectroles.can('taxonomy_read'), taxonomyViewHelper.getMetadataById);
    app.post('/private/v1/taxonomy/criteria/', connectroles.can('taxonomy_read'), taxonomyViewHelper.findByCriteria);
    app.get('/studio/taxonomy/create', connectroles.can('taxonomy_write'), function(req, res) {
        res.render('course/createTaxonomy.ejs', {
            title: 'Studio'
        });
    });

    //Pedagogy View Helper
    app.get('/private/v1/pedagogy/', connectroles.can('pedagogy_read'), pedagogyViewHelper.findAll);
    app.get('/private/v1/pedagogy/:id', connectroles.can('pedagogy_read'), pedagogyViewHelper.findById);
    app.get('/private/v1/pedagogy/nodesets/:id', connectroles.can('pedagogy_read'), pedagogyViewHelper.findAllNodeSets);
    app.get('/private/v1/pedagogy/getRootNode/:id', connectroles.can('pedagogy_read'), pedagogyViewHelper.getRootNode);
    app.get('/private/v1/pedagogy/nodeset/:id', connectroles.can('pedagogy_read'), pedagogyViewHelper.findNodeSetById);

    //Course View Helper routes
    app.get('/private/v1/course/courseStructure/:id', connectroles.can('course_read'), courseViewHelper.getCourseStructure);
    app.get('/private/v1/course/getById/:id', connectroles.can('course_read'), courseViewHelper.getCourse);
    app.post('/private/v1/course/create', connectroles.can('course_write'), courseViewHelper.createCourse);
    app.post('/private/v1/lob/create', connectroles.can('course_write'), courseViewHelper.createLOB);
    app.get('/private/v1/lob/:id', connectroles.can('course_read'), courseViewHelper.getLOBById);
    app.get('/private/v1/lob/delete/:id', connectroles.can('course_write'), courseViewHelper.deleteLOB);
    app.post('/private/v1/lob/metadata/update', connectroles.can('course_write'), courseViewHelper.updateLOBMetadata);
    app.get('/private/v1/lob/getMetadata/:id', connectroles.can('course_read'), courseViewHelper.getMetadata);
    app.post('/private/v1/lob/sequence/update', connectroles.can('course_write'), courseViewHelper.updateLOBSequence);
    app.get('/private/v1/course/save/:id', connectroles.can('course_write'), courseViewHelper.save);
    app.get('/private/v1/lob/getConcepts/:id', connectroles.can('course_read'), courseViewHelper.getConcepts);
    app.get('/private/v1/course/getOutcomes/:id', connectroles.can('course_read'), courseViewHelper.getCourseOutcomes);

    app.get('/studio/course/create', connectroles.can('course_write'), function(req, res) {
        res.render('course/createCourse.ejs', {
            title: 'Studio'
        });
    });

    app.get('/studio/course/courseStructure/:id', connectroles.can('course_read'), function(req, res) {
        req.session.courseId = req.params.id;
        res.locals.courseId = req.session.courseId;
        res.render('course/courseStructure.ejs', {
            title: 'Studio'
        });
    });

    app.get('/private/v1/course/fetchConceptTitleMap/:courseId', connectroles.can('public'), conceptViewHelper.fetchConceptTitleMap);
    app.get('/private/v1/course/fetchConceptMap/:courseId', connectroles.can('public'), conceptViewHelper.fetchConceptMap);
    app.post('/private/v1/course/fetchConceptMapByCategory/', connectroles.can('concept_read'), conceptViewHelper.fetchConceptMapByCategory);
    app.post('/private/v1/concept/content/', connectroles.can('concept_read'), conceptViewHelper.fetchContent);
    app.post('/private/v1/content/relatedConcepts/', connectroles.can('concept_read'), conceptViewHelper.fetchRelatedConcepts);
    app.get('/private/v1/concept/categoryReverseLookup', connectroles.can('concept_write'), conceptViewHelper.categoryReverseLookup);
    app.post('/private/v1/concept/contentList/', connectroles.can('concept_read'), conceptViewHelper.getContentsForConcepts);
    app.get('/private/v1/updateConceptMapCache/:courseId', conceptViewHelper.updateConceptsCache);
    //Content View Helper

    app.post('/private/v1/content/createMedia/:courseId', connectroles.can('content_write'), contentViewHelper.createMedia);
    app.get('/private/v1/content/getMedia/', connectroles.can('content_read'), contentViewHelper.getMedia);
    app.get('/private/v1/content/getAllMedia/', connectroles.can('content_read'), contentViewHelper.getAllMedia);
    app.post('/private/v1/content/createNew/:courseId', connectroles.can('content_write'), contentViewHelper.createNewContent);
    app.post('/private/v1/content/addMediaToContent/', connectroles.can('content_write'), contentViewHelper.addMediaToContent);
    app.post('/private/v1/content/addEnhanceMediaToContent/:contentId', connectroles.can('content_write'), contentViewHelper.addEnhanceMediaToContent);
    app.post('/private/v1/content/removeMediaFromContent/:contentId', connectroles.can('content_write'), contentViewHelper.removeMediaFromContent);
    app.post('/private/v1/content/addInterception', connectroles.can('content_write'), contentViewHelper.addInterception);


    app.get('/private/v1/content/getCourseContents/:courseId', connectroles.can('content_read'), contentViewHelper.getCourseContents);
    app.get('/private/v1/content/media/:courseId', connectroles.can('content_read'), contentViewHelper.getCourseMediaContent);
    app.get('/private/v1/content/learningActivity/:courseId', connectroles.can('content_read'), contentViewHelper.getCourseLearningActivityContent);
    app.get('/private/v1/content/getContentNodeSet/:courseId', connectroles.can('content_read'), contentViewHelper.getContentNodeSet);
    app.get('/private/v1/content/getContent/:id', connectroles.can('content_read'), contentViewHelper.getContent);
    app.post('/private/v1/content/saveMetadataInContent/:id', connectroles.can('content_write'), contentViewHelper.saveMetadataInContent);


    app.get('/view/:file', function(req, res) {
        res.render(req.params.file, {
            title: 'Studio'
        });
    });

    app.get('/studio/media/:courseId', connectroles.can('content_write'), function(req, res) {
        req.session.courseId = req.params.courseId;
        res.locals.courseId = req.session.courseId;
        res.render('content/createContent', {
            title: 'Studio - Content'
        });
    });

    app.get('/studio/content/:courseId', connectroles.can('content_write'), function(req, res) {
        req.session.courseId = req.params.courseId;
        res.locals.courseId = req.session.courseId;
        res.render('content/editContent', {
            title: 'Studio - Content'
        });
    });

    //LearningObject View Helper
    app.get('/studio/course/learningObjects/:id', connectroles.can('lob_read'), function(req, res) {
        req.session.courseId = req.params.id;
        res.locals.courseId = req.session.courseId;
        res.render('course/learningObjects.ejs', {
            title: 'Studio'
        });
    });

    app.get('/private/v1/lob/resources/:id', connectroles.can('lob_read'), lobViewHelper.findLOBElements);
    app.post('/private/v1/lob/getElement', connectroles.can('lob_read'), lobViewHelper.getElement);
    app.post('/private/v1/lob/elements/sequence', connectroles.can('lob_write'), lobViewHelper.updateSequence);

    app.get('/private/v1/lr/:id', connectroles.can('lr_read'), lrViewHelper.getLearningResource);
    app.post('/private/v1/lr/add', connectroles.can('lr_write'), lrViewHelper.addLearningResources);
    app.post('/private/v1/lr/metadata/update', connectroles.can('lr_write'), lrViewHelper.updateMetadata);

    app.get('/private/v1/la/:id', connectroles.can('la_read'), laViewHelper.getLearningActivity);
    app.post('/private/v1/la/add', connectroles.can('la_write'), laViewHelper.addLearningActivities);
    app.post('/private/v1/la/metadata/update', connectroles.can('la_write'), laViewHelper.updateMetadata);

    app.get('/studio/course/view/:id', connectroles.can('course_write'), function(req, res) {
        req.session.courseId = req.params.id;
        res.locals.courseId = req.session.courseId;
        res.render('course/studio.ejs', {
            title: 'Studio'
        });
    });

    app.get('/private/v1/lob/getExternalId/:lobId', connectroles.can('course_write'), dashboardViewHelper.getExternalId);
    app.get('/private/v1/binder/getByParent/:parentId', connectroles.can('course_write'), lobViewHelper.getBindersByParent);
    app.post('/private/studio/learningactivity', connectroles.can('course_write'), laViewHelper.saveLearningActivity);
    app.post('/private/v1/learningactivity/update', connectroles.can('course_write'), laViewHelper.updateLA);
    app.post('/private/studio/learningactivity/updatetoc', connectroles.can('course_write'), laViewHelper.addLearningActivityToTOC);
    app.post('/private/studio/searchTests', connectroles.can('course_read'), laViewHelper.getTestLearningActivities);
    app.post('/private/v1/learningactivity/getTest', connectroles.can('course_read'), laViewHelper.getTestLearningActivity)
    app.post('/private/studio/interception', connectroles.can('course_write'), laViewHelper.saveInterception);
    app.post('/private/studio/interception/delete', connectroles.can('course_write'), laViewHelper.deleteInterception);
    app.get('/private/studio/learningactivity/events/:laId', connectroles.can('course_write'), laViewHelper.getLearningActivityEvents);
    app.get('/private/v1/learningactivity/updateMetadataValues', laViewHelper.updateLAMetadataValues);
    app.get('/private/v1/learningactivities/:questionPaperId', connectroles.can('course_write'), laViewHelper.getLearningActivitiesByQuestionPaper)

    app.get('/private/v1/player/testData', testDataBuilder.createTestData);

    app.get('/private/v1/player/course/:courseId', connectroles.can('course_read'), dashboardViewHelper.getCourseInstance);
    app.post('/private/v1/player/course/selectedDiscoverContent', connectroles.can('learnerstate_write'), dashboardViewHelper.setLastDiscoverContent);
    app.get('/private/v1/player/lob/:courseId/:lobId', connectroles.can('lob_read'), dashboardViewHelper.getLearningObject);
    app.get('/private/v1/player/currentCourse', dashboardViewHelper.getCurrentCourse);

    app.get('/private/v1/player/playLob/:courseId/:lobId', connectroles.can('learnerstate_read'), playerViewHelper.playLob);
    app.get('/private/v1/player/playElement/:courseId/:lobId/:elementId', connectroles.can('learnerstate_read'), playerViewHelper.playElement);
    app.post('/private/v1/player/getClassRooms', connectroles.can('learnerstate_read'), playerViewHelper.getClassRooms);

    app.get('/private/player/dashboard', connectroles.can('user_read'), function(req, res) {
        /*console.log("User at dashboard is:"+JSON.stringify(req.roles));*/
        if(req.roles.indexOf('admin') == -1) {
            res.render('dashboard.ejs');
        } else {
            res.render('adminDashboard.ejs');
        }
    });
    app.get('/private/v1/player/student/dashboard', connectroles.can('student_read'), dashboardViewHelper.getStudentDashboard);
    app.post('/private/v1/player/student/upcomingEvents', connectroles.can('student_read'), dashboardViewHelper.getUpcomingEvents);
    app.post('/private/v1/player/user/updateProfile', connectroles.can('user_write'), dashboardViewHelper.updateUserProfile);
    app.post('/private/v1/player/user/updateImage', connectroles.can('user_write'), dashboardViewHelper.updateProfileImage);
    app.get('/private/v1/player/student/upcomingEvents/:id', dashboardViewHelper.getUpcomingEventsByCourseId);
    app.get('/private/v1/player/student/courseSummary/:courseId', dashboardViewHelper.getCourseSummary);
    app.get('/private/v1/organization/get/:id', connectroles.can('user_read'), adminViewHelper.getOrganization);
    app.get('/private/v1/player/dashboard/user', connectroles.can('user_read'), dashboardViewHelper.getUserDetails);
    app.get('/private/v1/player/dashboard/admin', dashboardViewHelper.getAdminDashboard);
    app.get('/private/v1/player/dashboard/tutor/', connectroles.can('instructor_read'), dashboardViewHelper.getTutorDetails);

    app.get('/private/v1/player/dashboard/tocByTime/:courseId', dashboardViewHelper.getTOCByTimeUnit);

    app.get('/private/player', connectroles.can('lob_read'), function(req, res) {
        res.locals.studentId = req.user.identifier;
        res.locals.courseId = req.session.courseId;
        res.render('player/player.ejs');
    });
    app.get('/private/player/course/:courseId', connectroles.can('lob_read'), dashboardViewHelper.getCourseId);
    app.get('/private/v1/player/toc/:courseId', connectroles.can('course_read'), dashboardViewHelper.getCourseTOC);


    // enrolled into given course

    app.get('/private/v1/player/completeElement/:courseId/:elementId/:timeSpent', connectroles.can('learnerstate_write'), learnerStateHelper.completeElement);
    app.post('/private/v1/player/setCurrentElementId/:courseId/:elementId', connectroles.can('learnerstate_write'), learnerStateHelper.setCurrentElementId);
    app.get('/private/v1/player/getCurrentElementId/:courseId', connectroles.can('learnerstate_read'), learnerStateHelper.getCurrentElementId);
    app.get('/private/v1/player/getStudentCoursePackage/:courseId', connectroles.can('learnerstate_read'), learnerStateHelper.getStudentCoursePackage);
    app.get('/private/v1/player/quiz/get/:quizUrl', connectroles.can('quiz_read'), quizViewHelper.getQuiz);
    app.post('/private/v1/player/quiz/getResult', connectroles.can('quiz_read'), quizViewHelper.getQuizResult);

    app.post('/private/v1/player/program/get', connectroles.can('program_read'), programViewHelper.getProgram);
    app.get('/private/v1/player/getLOBSupplementaryContent/:courseId/:lobId', connectroles.can('learnerstate_read'), additionalMaterialHelper.getLOBSupplementaryContent);
    app.get('/private/v1/player/getElementSupplementaryContent/:courseId/:elementId', connectroles.can('learnerstate_read'), additionalMaterialHelper.getElementSupplementaryContent);
    app.get('/private/v1/player/getAdditionalMaterial/:courseId/:lobId/:category', connectroles.can('learnerstate_read'), additionalMaterialHelper.getAdditionalMaterial);
    app.get('/private/v1/player/getLRAdditionalMaterial/:courseId/:lrId/:category', connectroles.can('learnerstate_read'), additionalMaterialHelper.getLRAdditionalMaterial);
    app.get('/private/v1/player/getLAAdditionalMaterial/:courseId/:laId/:category', connectroles.can('learnerstate_read'), additionalMaterialHelper.getLAAdditionalMaterial);
    app.get('/private/v1/player/getContentAdditionalMaterial/:courseId/:contentId/:category', connectroles.can('learnerstate_read'), additionalMaterialHelper.getContentAdditionalMaterial);
    app.get('/private/v1/player/addAdditionalMaterial/:courseId/:category/:lobId/:contentId', connectroles.can('learnerstate_write'), additionalMaterialHelper.addAdditionalMaterial);
    app.get('/private/v1/player/removeAdditionalMaterial/:courseId/:lobId/:contentId', connectroles.can('learnerstate_write'), additionalMaterialHelper.removeAdditionalMaterial);
    app.get('/private/v1/player/enrollCourse/:courseId/:packageId', connectroles.can('learnerstate_write'), learnerEnrollmentHelper.enrollCourse);
    app.get('/private/v1/player/updateLearnerPath/:courseId/:packageId', connectroles.can('learnerstate_write'), learnerEnrollmentHelper.updateLearnerPath);
    app.get('/private/v1/content/getInterceptionContent/:contentId', connectroles.can('content_read'), contentUtil.getInterceptionContent);
    app.get('/private/v1/content/streamURL/:url', connectroles.can('content_read'), contentUtil.streamURL);

    app.post('/private/v1/content/addConcept', connectroles.can('content_write'), contentViewHelper.addConcept);
    app.get('/private/v1/content/getAllConcepts', connectroles.can('content_read'), contentViewHelper.getAllConcepts);
    app.get('/private/v1/content/getMediaTypes', connectroles.can('content_read'), contentViewHelper.getMediaTypes);

    app.get('/private/v1/content/getForURL', connectroles.can('content_read'), contentViewHelper.getContentFromURL);

    app.post('/private/v1/player/LearningObjective/create', connectroles.can('learningobjective_write'), playerLearningObjectiveHelper.createLearningObjective);

    app.post('/private/v1/course/dashboard/:courseId', courseDashboardViewHelper.getCourseDashboardData);
    app.get('/private/v1/course/dashboard/export/:courseId', courseDashboardViewHelper.exportCourseDashboardData);
    app.post('/private/v1/course/summaryGraphs/:courseId', courseDashboardViewHelper.getCourseSummaryData);
    app.get('/private/v1/course/dashboard/searchFields/:courseId', courseDashboardViewHelper.getDashboardSearchFields);
    app.post('/private/v1/course/gradebook/:courseId', courseDashboardViewHelper.getCourseGradebookDetails);
    app.post('/private/v1/course/gradebook/create/:courseId', courseDashboardViewHelper.generateCourseGradebook);

    app.get('/private/v1/student/dashboard/:courseId/:studentId', studentDashboardViewHelper.getCourseDashboardData);
    app.get('/private/v1/student/dashboard/export/:courseId/:studentId', studentDashboardViewHelper.exportCourseDashboardData);
    app.get('/private/v1/student/courseSummary/:courseId/:studentId', studentDashboardViewHelper.getCourseSummary);
    app.post('/private/v1/student/leaderboards', studentDashboardViewHelper.getLeaderBoards);
    app.post('/private/v1/student/leaderboards/:courseId', studentDashboardViewHelper.getLeaderBoards);
    app.post('/private/v1/student/topStudents/:courseId', studentDashboardViewHelper.getTopStudents);

    app.post('/private/v1/student/topStreams/:courseId', studentDashboardViewHelper.getTopStreams);
    app.post('/private/v1/student/topColleges/:courseId', studentDashboardViewHelper.getTopColleges);

    app.post('/private/v1/student/gradebook/:courseId/:studentId', studentDashboardViewHelper.getGradebookData);
    app.get('/private/v1/student/gradecard/:courseId/:studentId', studentDashboardViewHelper.getStudentGradeCard);

    /*
	app.all('/js/*', setPublicCacheHeaders);
	app.all('/css/*', setPublicCacheHeaders);
	app.all('/img/*', setPublicCacheHeaders);
	app.all('/font/*', setPublicCacheHeaders);
	app.all('/fonts/*', setPublicCacheHeaders);
	app.all('/stylesheets/*', setPublicCacheHeaders);

	app.all('/js/controllers/*', setCacheHeaders);
	app.all('/js/dndTree-min.js', setCacheHeaders);
	app.all('/templates/*', setCacheHeaders);
	app.all('/uploads/*', setCacheHeaders);*/

    // Note Routes
    app.get('/private/v1/note/:id', connectroles.can('note_read'), noteViewHelper.findById);
    app.post('/private/v1/note/', connectroles.can('note_write'), noteViewHelper.saveNote);
    app.delete('/private/v1/note/:id', connectroles.can('note_delete'), noteViewHelper.delete);
    app.get('/private/v1/note/', connectroles.can('note_read'), noteViewHelper.findAll);
    app.patch('/private/v1/note/find/', connectroles.can('note_read'), noteViewHelper.findAll);
    app.patch('/private/v1/note/sync/', connectroles.can('note_write'), noteViewHelper.syncEvernote);
    app.get('/private/v1/notesBrowser/', connectroles.can('note_read'), noteViewHelper.getNotesBrowser);
    app.get('/private/v1/getDefaultNotesList', connectroles.can('note_read'), noteViewHelper.getDefaultNotesList);
    app.get('/private/v1/getCourseNotesList/:courseId/:skipCount', connectroles.can('note_read'), noteViewHelper.getCourseNotesList);
    app.get('/private/v1/getNotesList/:courseId/:elementId/:skipCount', connectroles.can('note_read'), noteViewHelper.getNotesList);
    app.get('/private/v1/getNotesList/:courseId/:skipCount', connectroles.can('note_read'), noteViewHelper.getNotesList);


    /* OAuth start */
    app.get('/private/v1/everNote/oauth', connectroles.can('note_write'), noteViewHelper.oauth);
    app.get('/private/v1/everNote/oauth_callback', connectroles.can('note_write'), noteViewHelper.oauth_callback);

    app.get('/private/v1/everNote/revoke', connectroles.can('note_write'), noteViewHelper.oauth);
    /*OAuth end */

    /*Evernote synchronisation */
    app.get('/private/v1/evernote/syncNotes', connectroles.can('note_write'), noteViewHelper.syncEvernote);
    app.get('/private/player/notebook', connectroles.can('note_read'), function(req, res) {
        res.render('student/notebook.ejs');

    });

    // Search Notes 
    app.post('/private/v1/note/searchNotes/', connectroles.can('note_read'), noteViewHelper.getSearchNotes);


    // User Management
    app.get('/private/v1/user/:id', connectroles.can('user_read'), userViewHelper.findById);
    app.post('/private/v1/user/', connectroles.can('user_write'), userViewHelper.saveUser);
    app.delete('/private/v1/user/:id', connectroles.can('user_delete'), userViewHelper.delete);
    app.get('/private/v1/user/', connectroles.can('user_read'), userViewHelper.findAll);

    app.post('/private/v1/question/import', connectroles.can('content_write'), assessmentViewHelper.importAssessmentItems);
    app.patch('/private/read/admin_middleware/', connectroles.can('middleware_read'), learnerMiddlewareViewHelper.callServiceStandard);
    app.patch('/private/write/admin_middleware/', connectroles.can('middleware_write'), learnerMiddlewareViewHelper.callServiceStandard);
    app.patch('/private/learner_middleware/', connectroles.can('learnerstate_write'), learnerMiddlewareViewHelper.callServiceStandard);

    // get all per-defined serches
    app.get('/private/v1/player/learner/search/:courseId', connectroles.can('user_read'), learnerSearchVH.getLearnerSearchConfig);
    app.post('/private/v1/player/learner/search', connectroles.can('user_read'), learnerSearchVH.searchLearners);

    app.post('/private/logstream/', logStreamHelper.saveLogStream);
    app.post('/private/v1/coaching/addBinder/', coachingViewHelper.addBinder);

    app.get('/private/v1/logout', connectroles.can('user_read'), function(req, res) {
        req.logout();
        res.redirect('/home');
    });

    // Ilimi Programming IDE
    app.post('/private/v1/player/getProgrammingURL/', connectroles.can('user_read'), dashboardViewHelper.getProgrammingURL);
    app.get('/private/v1/player/getUserInfo/', function(req, res) {
        var user = {};
        user.userRoles = [];
        user.userRoles = req.user.roles;
        // user.identifier = req.user.local.email;
        user.identifier = req.user.identifier;
        // user.identifier = req.user.uniqueId;
        user.displayName = req.user.displayName;
        user.image = req.user.image;
        res.send(user);
    });

    // get search content
    app.post('/private/v1/player/searchContent/', connectroles.can('user_read'),  contentSearchViewHelper.getSearchContent);
    app.post('/private/v1/player/createBinder/',  connectroles.can('user_write'), contentSearchViewHelper.createBinder);
    app.post('/private/v1/player/addContentIntoBinder/',    connectroles.can('content_write'), contentSearchViewHelper.addContentIntoBinder);
    app.post('/private/v1/player/removeContentIntoBinder/',  connectroles.can('content_write'), contentSearchViewHelper.removeContentIntoBinder);
    app.get('/private/v1/player/getBinders/:courseId',    connectroles.can('user_read'),  contentSearchViewHelper.getBinders);
    app.get('/private/v1/player/getBinder/:binderId',     connectroles.can('user_read'),  contentSearchViewHelper.getBinder);
    app.post('/private/v1/player/getBinderContentItems/',  connectroles.can('user_read'), contentSearchViewHelper.getBinderContentItems);

    // Manage Coaching Sessions
    app.get('/private/v1/player/getCoachingSession/:courseId',   connectroles.can('user_read'),  manageCoachingViewHelper.getCoachingSession);
    app.get('/private/v1/player/coachingSession/:sessionId',     connectroles.can('user_read'),  manageCoachingViewHelper.getCoachingSessionDetails);
    app.post('/private/v1/player/getAllEventsOfCoachingSession/',    connectroles.can('user_read'), manageCoachingViewHelper.getAllEventsOfCoachingSession);
    app.post('/private/v1/player/createCoachingSession/',  connectroles.can('user_write'), manageCoachingViewHelper.createCoachingSession);
    app.post('/private/v1/player/addEventIntoCoachingSession/',    connectroles.can('user_write'), manageCoachingViewHelper.addEventIntoCoachingSession);
    app.post('/private/v1/player/getEnvitedUserDetails/',    connectroles.can('user_read'), manageCoachingViewHelper.getEnvitedUserDetails);

    // Edit Learning resource
    app.get('/private/studio/lob/:level/:id', thirdpartyViewHelper.getLearningObject);
    app.post('/private/studio/scribd', function(req, res){
        thirdpartyViewHelper.uploadFileToScribd(req, res);
    });
    app.get('/private/studio/lr/content/:id', function(req, res){
        thirdpartyViewHelper.getContentMetadata(req, res);
    });
    app.post('/private/studio/lob', thirdpartyViewHelper.saveLearningObject);
    app.post('/private/studio/content', thirdpartyViewHelper.getSearchContent);

    app.post('/private/v1/course/inbox/checkTokens', connectroles.can('content_write'), adminViewHelper.checkInboxTokens);
    app.post('/private/v1/course/setInbox', connectroles.can('content_write'), adminViewHelper.setCourseInbox);
    app.post('/private/v1/course/community', connectroles.can('content_write'), adminViewHelper.prepareCourseCommunity);
    app.post('/private/v1/course/community/clear', connectroles.can('content_write'), enrollmentImportHelper.clearCourseCommunity);
    app.post('/private/v1/course/community/reset', connectroles.can('content_write'), enrollmentImportHelper.resetCourseCommunity);

    app.post('/private/users/getDisplayName', connectroles.can('content_write'), userViewHelper.getDisplayNamesByIds)

    app.get('/private/v1/assessments/export/:id', connectroles.can('content_write'), assessmentsImportExportViewHelper.exportAssessmentData);
    app.post('/private/v1/assessments/import/', connectroles.can('content_write'), assessmentsImportExportViewHelper.importAssessmentData);

    app.post('/private/v1/user/changePassword', connectroles.can('user_write'), userViewHelper.changeUserPassword);
    app.post('/public/v1/user/forgotPassword', userViewHelper.forgotPassword);
    app.get('/public/user/resetpassword/:token', function(req, res) {
        res.locals.token = req.params.token;
        res.render('web/forgotPassword.ejs');
    });
    app.post('/public/user/updateForgotPassword', userViewHelper.updateForgotPassword);

    app.get('/private/v1/player/loadFedoraIds', idCacheUtil.loadFedoraIds);

    app.get('/player/termsandconditions', connectroles.can('user_write'), function(req, res) {
        res.render('web/termsandconditions.ejs');
    });

    app.post('/private/v1/termsandconditions', connectroles.can('user_write'), userViewHelper.agreeTermsAndConditions);

    app.get('/classroomresources', connectroles.can('public'), function(req, res) {
        res.render('web/comingsoon.ejs');
    });
    app.get('/communities', connectroles.can('public'), function(req, res) {
        res.render('web/comingsoon.ejs');
    });
    app.get('/teacherregistry', connectroles.can('public'), function(req, res) {
        res.render('web/comingsoon.ejs');
    });
    app.get('/testyourself', connectroles.can('public'), function(req, res) {
        res.render('web/comingsoon.ejs');
    });
};

function logMarker(req, res) {
    var data = req.body.data;
    var time = (new Date()).getTime();
    LoggerUtil.log('Marker', process.domain, time, time, data);
    res.send('ok');
}

function logJmeterLogs(req, res) {
    var log = req.body;
    process.domain.logObject = log;
    LoggerUtil.log('JMeter', process.domain, log.timestamp, log.timestamp + log.executionTime);
    res.send('OK');
}

function setUser(req, res, next) {
    //console.log('Set user called: ' + req.path);
    if (!req.roles) {
        req.roles = ["public"];
    }
    if (req.user) {
        res.locals.user = req.user;
        req.roles = req.user.roles;
        req.roles.push("public");
    }
    next();
}


function setCacheHeaders(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=86400000');
    //res.setHeader("Expires", new Date(Date.now() + 86400000).toUTCString());
    next();
}

function setPublicCacheHeaders(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=604800000');
    //res.setHeader("Expires", new Date(Date.now() + 604800000).toUTCString());
    next();
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log('User not authenticated');
    }

    // if they aren't redirect them to the home page
    res.redirect('/home');
}

function isAcceptedTAndC(req, res, next) {
    if (req.path == '/private/v1/logout' || (req.path.match(/\/private\/v1\/user\/.+\/profile/g) != '' && req.path.match(/\/private\/v1\/user\/.+\/profile/g) != null) || req.path == '/private/v1/termsandconditions' || (req.user.termsAndConditions && req.user.termsAndConditions.accept)) {
        return next();
    } else {
        console.log('User yet to accept T&C.');
    }
    res.redirect('/player/termsandconditions');
}