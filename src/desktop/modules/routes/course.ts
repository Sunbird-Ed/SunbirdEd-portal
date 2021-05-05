import * as _ from "lodash";
import { customProxy } from '../helper/proxyHandler';

export default (app, proxyURL) => {
    const defaultProxyConfig = { 
        isUserTokenRequired: true, 
        isAuthTokenRequired: true, 
        bypassLearnerRoute: true, 
        bypassContentRoute: true
    };

    app.get([
        "/learner/course/v1/user/enrollment/list/:courseId",
        "/learner/course/v1/batch/read/:batchId",
    ], customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post([
        "/learner/course/v1/batch/list", 
        "/learner/user/v1/search", 
        "/learner/course/v1/enrol",
        "/learner/course/v1/unenrol",
        "/discussion/forum/v2/read",
        "/content/course/v1/content/state/read",
    ], customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.patch([
        "/content/course/v1/content/state/update", 
    ], customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

}