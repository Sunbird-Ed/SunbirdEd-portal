import * as _ from "lodash";
import Response from "./../utils/response";
import { manifest } from "./../manifest";
import AuthController from "../controllers/authController";
import { containerAPI } from '@project-sunbird/OpenRAP/api';
import { logger } from '@project-sunbird/logger';

export default (app, proxyURL) => {

    const authController = new AuthController(manifest);
    app.post(
        "/api/user/v1/startSession", authController.startUserSession.bind(authController),
    );

    app.get("/learner/user/v3/read/:id", async (req, res) => {
        try {
            const userSDK = containerAPI.getUserSdkInstance();
            const user = await userSDK.getLoggedInUser(req.params.id);
            res.send(Response.success("api.user.read", { response: user }, req));
        } catch (error) {
            logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while reading user= ${error}`);
            return res.status(500).send(Response.error("api.user.read", 500));
        }
    });

}