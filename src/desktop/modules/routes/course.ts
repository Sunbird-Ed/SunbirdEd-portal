import * as _ from 'lodash';
import BatchDetails from '../controllers/batchDetails';
import ContentStatus from '../controllers/content/contentStatus';
import Course from '../controllers/course';
import { customProxy } from '../helper/proxyHandler';
import { manifest } from "./../manifest";

const batchDetails = new BatchDetails(manifest);
const course = new Course(manifest);
const contentStatus = new ContentStatus(manifest);

export default (app, proxyURL) => {
    const defaultProxyConfig = {
        isUserTokenRequired: true,
        isAuthTokenRequired: true,
        bypassLearnerRoute: true,
        bypassContentRoute: true
    };

    app.get("/learner/course/v1/user/enrollment/list/:courseId", customProxy(proxyURL, defaultProxyConfig), async (req, res) => {
        const courses = _.get(res, 'body.result.courses');
        if (courses) {
            await course.saveEnrolledList(courses);
            res.status(res.statusCode).send(res.body);
        } else {
            await course.getLocalEnrolledList(req, res);
        }
    });

    app.get("/learner/course/v1/batch/read/:batchId", customProxy(proxyURL, defaultProxyConfig), async (req, res) => {
        if (_.get(res, 'body.result.response')) {
            await batchDetails.save(res.body.result.response);
            res.status(res.statusCode).send(res.body);
        } else {
            await batchDetails.get(req, res);
        }
    });

    app.post([
        "/learner/course/v1/batch/list",
        "/learner/user/v1/search",
        "/learner/course/v1/enrol",
        "/learner/course/v1/unenrol",
        "/discussion/forum/v2/read",
    ], customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post("/learner/user/v2/search", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });


    app.post("/content/course/v1/content/state/read", customProxy(proxyURL, defaultProxyConfig), async (req, res) => {
        const contentList = _.get(res, 'body.result.contentList');
        if (contentList) {
            await contentStatus.saveContentStatus(contentList);
            await contentStatus.getLocalContentStatusList(req, res);
        } else {
            await contentStatus.getLocalContentStatusList(req, res);
        }
    });

    app.patch("/content/course/v1/content/state/update", customProxy(proxyURL, defaultProxyConfig), async (req, res) => {
        await contentStatus.update(req, res);
    });
}
