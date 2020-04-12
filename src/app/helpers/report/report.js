const Router = require("express-promise-router");
const db = require("./db");
const router = new Router();
const _ = require("lodash");
const { SUNBIRD_PORTAL_BASE_URL } = require("../environmentVariablesHelper");
const constants = require("../../constants/reports.constants");
const v4 = require("uuid/v4");
const dateFormat = require("dateformat");
const { sendApiResponse } = require("./services/apiResponse");

const {
  validateCreateReportAPI,
  validateReadReportAPI,
  validateDeleteReportAPI,
  validateListReportAPI,
  validateUpdateReportAPI,
} = require("./middlewares/validateReport");

module.exports = router;

router.get("/get/:reportId", validateReadReportAPI, async (req, res) => {
  const { reportId } = _.get(req, "params");
  const id = _.get(req, "id") || "api.report.get";
  try {
    const {
      rows,
      rowCount,
    } = await db.query(
      `SELECT * FROM ${constants.REPORT_TABLE_NAME} WHERE reportId = $1`,
      [reportId]
    );
    if (rowCount > 0) {
      const result = {
        reports: rows,
        count: rowCount,
      };
      res.status(200).send(
        sendApiResponse({
          id,
          responseCode: constants.RESPONSE_CODE.SUCCESS,
          result,
          params: {},
        })
      );
    } else {
      res.status(404).send(
        sendApiResponse({
          id,
          responseCode: constants.RESPONSE_CODE.SERVER_ERROR,
          params: {
            status: constants.STATUS.FAILED,
            errmsg: constants.MESSAGES.NO_REPORT,
          },
        })
      );
    }
  } catch (err) {
    res.status(500).send(
      sendApiResponse({
        id,
        params: {
          err: JSON.stringify(err),
          status: constants.STATUS.FAILED,
          errmsg: _.get(err, "message"),
        },
        responseCode: constants.RESPONSE_CODE.SERVER_ERROR,
      })
    );
  }
});

router.post("/create", validateCreateReportAPI, async (req, res) => {
  const reqBody = _.get(req, "body.request.report");
  const id = _.get(req, "id") || "api.report.create";
  try {
    const reportid = _.get(reqBody, "reportid") || v4();
    const reportaccessurl =
      _.get(reqBody, "reportaccessurl") ||
      `${SUNBIRD_PORTAL_BASE_URL}/dashBoard/reports/${reportid}`;
    const body = { reportid, reportaccessurl, ...reqBody };
    const query = `INSERT INTO ${constants.REPORT_TABLE_NAME} (${_.join(
      _.keys(body),
      ","
    )}) SELECT ${_.join(_.keys(body), ",")} FROM jsonb_populate_record(NULL::${
      constants.REPORT_TABLE_NAME
      }, '${JSON.stringify(body)}')`;

    const { rows, rowCount } = await db.query(query);
    const result = {
      reportId: reportid,
      reportaccessurl,
    };
    res.status(200).send(
      sendApiResponse({
        id,
        responseCode: constants.RESPONSE_CODE.SUCCESS,
        result,
        params: {},
      })
    );
  } catch (err) {
    res.status(500).send(
      sendApiResponse({
        id,
        params: {
          err: JSON.stringify(err),
          status: constants.STATUS.FAILED,
          errmsg: _.get(err, "message"),
        },
        responseCode: constants.RESPONSE_CODE.SERVER_ERROR,
      })
    );
  }
});

router.delete(
  "/delete/:reportId",
  validateDeleteReportAPI,
  async (req, res) => {
    const id = _.get(req, "id") || "api.report.delete";
    const { reportId } = _.get(req, "params");
    try {
      const {
        rows,
        rowCount,
      } = await db.query(
        `DELETE FROM ${constants.REPORT_TABLE_NAME} WHERE reportId = $1`,
        [reportId]
      );
      if (rowCount > 0) {
        const result = {
          reportId,
        };
        res.status(200).send(
          sendApiResponse({
            id,
            responseCode: constants.RESPONSE_CODE.SUCCESS,
            result,
            params: {},
          })
        );
      } else {
        res.status(404).send(
          sendApiResponse({
            id,
            responseCode: constants.RESPONSE_CODE.SERVER_ERROR,
            params: {
              status: constants.STATUS.FAILED,
              errmsg: constants.MESSAGES.NO_REPORT,
            },
          })
        );
      }
    } catch (err) {
      res.status(500).send(
        sendApiResponse({
          id,
          params: {
            err: JSON.stringify(err),
            status: constants.STATUS.FAILED,
            errmsg: _.get(err, "message"),
          },
          responseCode: constants.RESPONSE_CODE.SERVER_ERROR,
        })
      );
    }
  }
);

router.patch("/update/:reportId", validateUpdateReportAPI, async (req, res) => {
  const id = _.get(req, "id") || "api.report.update";
  const { reportId } = _.get(req, "params");
  const reqBody = _.get(req, "body.request.report");
  try {
    if (_.keys(reqBody).length) {
      const updatedon = dateFormat(new Date());
      const body = { ...reqBody, updatedon };
      const query = `UPDATE ${constants.REPORT_TABLE_NAME} SET ${_.join(
        _.map(
          body,
          (value, key) =>
            `${key} = '${
            typeof value === "object" ? JSON.stringify(value) : value
            }'`
        ),
        ", "
      )} WHERE reportid = $1`;

      console.log(query);
      const { rows, rowCount } = await db.query(query, [reportId]);
      if (rowCount > 0) {
        const result = {
          reportId,
        };
        res.status(200).send(
          sendApiResponse({
            id,
            responseCode: constants.RESPONSE_CODE.SUCCESS,
            result,
            params: {},
          })
        );
      } else {
        res.status(404).send(
          sendApiResponse({
            id,
            responseCode: constants.RESPONSE_CODE.SERVER_ERROR,
            params: {
              status: constants.STATUS.FAILED,
              errmsg: constants.MESSAGES.NO_REPORT,
            },
          })
        );
      }
    } else {
      res.status(400).send(
        sendApiResponse({
          id,
          responseCode: "CLIENT_ERROR",
          params: {
            status: constants.STATUS.FAILED,
            errmsg: constants.MESSAGES.NO_COLUMNS_TO_UPDATE,
          },
        })
      );
    }
  } catch (err) {
    res.status(500).send(
      sendApiResponse({
        id,
        params: {
          err: JSON.stringify(err),
          status: constants.STATUS.FAILED,
          errmsg: _.get(err, "message"),
        },
        responseCode: constants.RESPONSE_CODE.SERVER_ERROR,
      })
    );
  }
});

router.post("/list", validateListReportAPI, async (req, res) => {
  const id = _.get(req, "id") || "api.report.list";
  const filters = _.get(req, "body.request.filters") || {};
  const whereClause = _.keys(filters).length
    ? `WHERE ${_.join(
      _.map(
        filters,
        (value, key) =>
          `${key} IN (${_.join(
            _.map(value, (val) => `'${val}'`),
            ", "
          )})`
      ),
      " AND "
    )}`
    : "";
  try {
    const query = `SELECT * FROM ${constants.REPORT_TABLE_NAME} ${whereClause}`;
    const { rows, rowCount } = await db.query(query);
    const result = {
      reports: rows,
      count: rowCount,
    };
    res.status(200).send(
      sendApiResponse({
        id,
        responseCode: constants.RESPONSE_CODE.SUCCESS,
        result,
        params: {},
      })
    );
  } catch (err) {
    res.status(500).send(
      sendApiResponse({
        id,
        params: {
          err: JSON.stringify(err),
          status: constants.STATUS.FAILED,
          errmsg: _.get(err, "message"),
        },
        responseCode: constants.RESPONSE_CODE.SERVER_ERROR,
      })
    );
  }
});
