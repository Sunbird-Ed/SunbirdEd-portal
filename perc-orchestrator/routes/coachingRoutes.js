var coachingVH = require('../coaching/view_helpers/CoachingViewHelper');

module.exports = function(app, dirname, passport) {

    app.all('/*', setUser);

    /** Routes for adding binders and coaching */
    app.post('/private/v1/coaching/objects', coachingVH.getObjects);
    app.post('/private/v1/coaching/object', coachingVH.getObject);
    app.get('/private/v1/coaching/senderList/:courseId', coachingVH.getMyStudents);

    app.post('/private/v1/coaching/event/get', coachingVH.getEventDetails);
    app.post('/private/v1/coaching/event/accept', coachingVH.acceptEvent);
    app.post('/private/v1/coaching/event/decline', coachingVH.declineEvent);

    app.post('/private/v1/coaching/post', coachingVH.postActivity);

    app.post('/private/v1/coaching/list/create', coachingVH.createList);
    app.delete('/private/v1/coaching/list/:listId', coachingVH.deleteList);
    app.post('/private/v1/coaching/list/add', coachingVH.addMemberToList);
    app.post('/private/v1/coaching/list/remove', coachingVH.removeMemberFromList);

    app.post('/private/v1/coaching/event/updateMedia', coachingVH.addMediaToEvent);
    app.post('/private/v1/coaching/rebalanceCoaches', coachingVH.rebalanceCoaches);
};

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