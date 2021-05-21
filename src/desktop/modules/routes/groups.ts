import { customProxy } from '../helper/proxyHandler';

export default (app, proxyURL) => {
    const defaultProxyConfig = {
        isUserTokenRequired: true,
        isAuthTokenRequired: true,
        bypassLearnerRoute: true,
        bypassContentRoute: true
    };

    app.post("/learner/group/v1/create", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post("/learner/group/v1/list", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.patch("/learner/group/membership/v1/update", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.get("/learner/group/v1/read/:groupId", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.patch("/learner/group/v1/update", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post("/learner/group/v1/delete", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post("/learner/data/v1/group/activity/agg", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });


    // Group Member
    app.get("/learner/user/v2/exists/userName/:memberId", customProxy(proxyURL, defaultProxyConfig), (req,  res) => {
        res.status(res.statusCode).send(res.body);
    });

    // Discussion
    app.post("/discussion/forum/v3/create", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post("/discussion/user/v1/create", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.get("/discussion/user/:id", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.get("/discussion/category/:id", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post("/discussion/forum/tags", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.get("/discussion/user/:id/bookmarks", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.get("/discussion/user/:id/upvoted", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.get("/discussion/user/:id/downvoted", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });
}