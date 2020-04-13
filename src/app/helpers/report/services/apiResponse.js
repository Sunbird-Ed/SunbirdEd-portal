const v1 = require("uuid/v1");
const fs = require("fs");
const constants = require("../../../constants/reports.constants");
const packageObj = JSON.parse(fs.readFileSync("package.json", "utf8"));
const { get } = require("lodash");

const sendApiResponse = ({
  id = "api.report",
  responseCode = constants.RESPONSE_CODE.SUCCESS,
  result = {},
  params: {
    err = null,
    errmsg = null,
    status = constants.STATUS.SUCCESS,
    msgid = null,
  },
}) => ({
  id: id,
  ver: get(packageObj, "version") || "1.0",
  ets: Date.now(),
  params: {
    resmsgid: v1(),
    msgid: msgid,
    status: status,
    err: err,
    errmsg: errmsg,
  },
  responseCode: responseCode,
  result: result,
});

module.exports = {
  sendApiResponse,
};
