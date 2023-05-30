export const mockRes = {
    generateOtpData: {
        id: "api.otp.generate",
        ver: "v1",
        ts: "2020-01-08 07:49:17:041+0000",
        params: {
            resmsgid: null,
            msgid: null,
            err: null,
            status: "success",
            errmsg: null,
        },
        responseCode: "OK",
        result: {
            response: "SUCCESS",
        },
    },

    tncData: {
        id: "api.tnc",
        ver: "v1",
        ts: "2020-01-08 07:49:17:041+0000",
        params: {
            resmsgid: null,
            msgid: null,
            err: null,
            status: "success",
            errmsg: null,
        },
        responseCode: "OK",
        result: {
            response: "SUCCESS",
        },
    },

    generateAnonymousOtpData: {
        id: "api.anonymous.otp.generate",
        ver: "v1",
        ts: "2020-01-08 07:49:17:041+0000",
        params: {
            resmsgid: null,
            msgid: null,
            err: null,
            status: "success",
            errmsg: null,
        },
        responseCode: "OK",
        result: {
            response: "SUCCESS",
        },
    },

    verifyOtpData: {
        id: "api.otp.verify",
        ver: "v1",
        ts: "2022-11-10 06:23:35:600+0000",
        params: {
            resmsgid: "f629cd18-0488-b2e3-45e6-a452545026ca",
            msgid: "f629cd18-0488-b2e3-45e6-a452545026ca",
            err: null,
            status: "SUCCESS",
            errmsg: null,
        },
        responseCode: "OK",
        result: { response: "SUCCESS" },
    },
    createUserData: {

        id: "api.create.user",
        ver: "v2",
        ets: 0,
        ts: "2022-11-10 07:06:43:959+0000",
        params: {
            resmsgid: "5cc3ff2a-8001-10d7-aa4f-7aef90a2ac39",
            msgid: "5cc3ff2a-8001-10d7-aa4f-7aef90a2ac39",
            err: null,
            status: "SUCCESS",
            errmsg: null,
        },
        result: {
            status: "SUCCESS",
        },
        responseCode: "OK",
    },

    signupUserData: {
        id: "api.user.signup",
        ver: "v2",
        ts: "2022-11-10 06:58:49:171+0000",
        params: {
            resmsgid: "5cc3ff2a-8001-10d7-aa4f-7aef90a2ac39",
            msgid: "5cc3ff2a-8001-10d7-aa4f-7aef90a2ac39",
            err: null,
            status: "SUCCESS",
            errmsg: null,
        },
        responseCode: "OK",
        result: {
            response: { isUserExists: true },
            userId: "70801e74-6f2d-4bd0-8ee5-2ad3d268abac",
        },
    },

    verifyUserData: {
        id: "api.user.exists.email",
        ver: "v1",
        ts: "2022-11-10 07:06:43:959+0000",
        params: {
            resmsgid: "fc34da57-3201-f9bb-734e-a9aaa3635505",
            msgid: "fc34da57-3201-f9bb-734e-a9aaa3635505",
            err: null,
            status: "SUCCESS",
            errmsg: null,
        },
        responseCode: "OK",
        result: { exists: true },
    },

    getUserData: {
        id: "api.user.get",
        ver: "v1",
        ts: "2022-11-10 07:06:43:959+0000",
        params: {
            resmsgid: "fc34da57-3201-f9bb-734e-a9aaa3635505",
            msgid: "fc34da57-3201-f9bb-734e-a9aaa3635505",
            err: null,
            status: "SUCCESS",
            errmsg: null,
        },
        responseCode: "OK",
        result: { exists: true },
    }
}

