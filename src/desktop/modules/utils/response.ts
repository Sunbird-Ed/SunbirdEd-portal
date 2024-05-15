import{ v4 as uuid} from "uuid";

export default class Response {
  public static success(id, result, req) {
    // prepare success response object
    req.rid = id;
    const resObj = {
      id,
      ver: "1.0",
      ts: new Date().toISOString(),
      params: {
        resmsgid: uuid(),
        msgid: uuid(),
        status: "successful",
        err: null,
        errmsg: null,
      },
      responseCode: "OK",
      result,
    };
    return resObj;
  }

  public static error(id, responseCode, errmsg?, errCode?) {
    // prepare error response object
    let resObj = {};
    if (responseCode === 404) {
      resObj = {
        id,
        ver: "1.0",
        ts: new Date().toISOString(),
        params: {
          resmsgid: uuid(),
          msgid: uuid(),
          status: "failed",
          err: errCode || "ERR_DATA_NOT_FOUND",
          errmsg: errmsg || "Data not found",
        },
        responseCode: "RESOURCE_NOT_FOUND",
        result: {},
      };
    } else if (responseCode === 400) {
      resObj = {
        id,
        ver: "1.0",
        ts: new Date().toISOString(),
        params: {
          resmsgid: uuid(),
          msgid: uuid(),
          status: "failed",
          err: errCode || "ERR_BAD_REQUEST",
          errmsg: errmsg || "Error while processing the request ",
        },
        responseCode: "CLIENT_ERROR",
        result: {},
      };
    } else if (responseCode === 507) {
      resObj = {
        id,
        ver: "1.0",
        ts: new Date().toISOString(),
        params: {
          resmsgid: uuid(),
          msgid: uuid(),
          status: "failed",
          err: errCode || "LOW_DISK_SPACE",
          errmsg: errmsg || "Low Disk space",
        },
        responseCode: "CLIENT_ERROR",
        result: {},
      };
    } else if (responseCode === 401) {
      resObj = {
        id,
        ver: "1.0",
        ts: new Date().toISOString(),
        params: {
          resmsgid: uuid(),
          msgid: uuid(),
          status: "failed",
          err: errCode || "UNAUTHORIZED",
          errmsg: errmsg || "You don't have permission to access this resource",
        },
        responseCode: "CLIENT_ERROR",
        result: {},
      };
    } else {
      resObj = {
        id,
        ver: "1.0",
        ts: new Date().toISOString(),
        params: {
          resmsgid: uuid(),
          msgid: uuid(),
          status: "failed",
          err: errCode || "ERR_INTERNAL_SERVER_ERROR",
          errmsg: errmsg || "Error while processing the request",
        },
        responseCode: "INTERNAL_SERVER_ERROR",
        result: {},
      };
    }
    return resObj;
  }
}
