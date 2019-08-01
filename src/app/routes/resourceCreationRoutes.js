const proxyUtils = require("../proxy/proxyUtils.js");
const bodyParser = require("body-parser");
const request = require("request-promise");
const uuid = require("uuid/v1");
const _ = require("lodash");
const dateFormat = require("dateformat");
const { from, forkJoin } = require("rxjs");
const envHelper = require("./../helpers/environmentVariablesHelper.js");
const contentProxyUrl = envHelper.CONTENT_PROXY_URL;
const resourceCreationHelper = require("../helpers/resourceCreationHelper.js");

const questionTypeName = {
    VSA: 'Very Short Answer',
    SA: 'Short Answer',
    LA: 'Long Answer',
    MCQ: 'Multiple Choice Question',
    CuriosityQuestion: 'Curiosity Question'
  }

module.exports = function(app) {
  const getHeaders = req => {
    return {
      "x-device-id": req.get("x-device-id"),
      "x-msgid": uuid(),
      ts: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
      "content-type": "application/json",
      accept: "application/json",
      Authorization: req.get("Authorization"),
      "X-Authenticated-User-Token": req.get("X-Authenticated-User-Token"),
      "x-authenticated-userid": req.get("x-authenticated-userid")
    };
  };

  app.post(
    "/worksheet/v3/create",
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    async (req, res) => {
      // console.log(req)
      const options = {
        method: "POST",
        url: contentProxyUrl + "/action/content/v1/create",
        headers: getHeaders(req),
        body: {
          request: req
        },
        json: true
      };

      let requestBody = req.body.request;
      if(!requestBody.content && !requestBody.content.questions && requestBody.content.questions.length < 1) {
        res.status(400);
        res.json({
            "id": "api.worksheet.create",
            "ver": "1.0",
            'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
            "params": {
                "resmsgid": uuid(),
                "status": "failed",
                "err": "error",
                "errmsg": "no question id present"
            },
            "responseCode": "FAILED" ,
            "result": {}
        });
        return;
    }
    if(!requestBody.content.contentType && _.isEmpty(requestBody.content.contentType) ) {
        res.status(400)
        res.json({
            "id": "api.worksheet.create",
            "ver": "1.0",
            'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
            "params": {
                "resmsgid": uuid(),
                "status": "failed",
                "err": "error",
                "errmsg": "contentType is missing or invalid"
            },
            "responseCode": "FAILED" ,
            "result": {}
        });
        return;
    }
      const questions = [];
      _.forEach(_.get(requestBody.content, "questions"), value => {
        questions.push({ identifier: value });
      });

      resourceCreationHelper
        .getECMLJSON(options.headers, req.body.request.content.questions)
        .subscribe(theme => {
          const option = {
            url: `${contentProxyUrl}/content/content/v1/create`,
            headers: getHeaders(req),
            json: true,
            body: {
              request: {
                content: {
                  name: requestBody.content.name || `${questionTypeName[theme.questionSetMeta.questionSetCategory]} - ${requestBody.content.topic.join(', ')}`,
                  code: uuid(),
                  description: requestBody.content.description || `These are ${questionTypeName[theme.questionSetMeta.questionSetCategory]}s about ${requestBody.content.topic.join(', ')}`,
                  createdBy: "edce4f4f-6c82-458a-8b23-e3521859992f",
                  contentType: requestBody.content.contentType || "PracticeQuestionSet",
                  mimeType: "application/vnd.ekstep.ecml-archive",
                  programId: requestBody.content.programId,
                  program: requestBody.content.program,
                  framework: requestBody.content.framework,
                  board: requestBody.content.board,
                  medium: requestBody.content.medium,
                  gradeLevel: requestBody.content.gradeLevel,
                  subject: requestBody.content.subject,
                  topic: requestBody.content.topic,
                  creator: "Content Creator",
                  editorVersion: 3,
                  body: JSON.stringify(theme.theme),
                  resourceType: requestBody.content.resourceType || "Practice",
                  questions: questions,
                  author: theme.questionSetMeta.questionSetAuthor,
                  attributions: theme.questionSetMeta.questionSetAttribution,
                  languageCode: requestBody.content.languageCode || 'en',
                  // tslint:disable-next-line: max-line-length
                  appIcon:
                    "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11279144369168384014/artifact/qa_1561455529937.png"
                }
              }
            }
          };

          from(request.post(option)).subscribe(
            res => {
              if (res.responseCode === "OK" && res.result.content_id !== undefined) {
                publishResource(res.result.content_id);
              }
            },
            error => {
              console.log(
                "error",
                _.get(error, "error.params.errmsg") || "content creation failed"
              );
              res.status(400);
              res.json({
                "id": "api.worksheet.create",
                "ver": "1.0",
                'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
                "params": {
                    "resmsgid": uuid(),
                    "status": "failed",
                    "err": "error",
                    "errmsg": _.get(error, "error.params.errmsg") || "content creation failed"
                },
                "responseCode": "FAILED" ,
                "result": {}
            });
            }
          );
        }, err => {
            res.status(err.statusCode);
            res.json(err.error);
        });

      function publishResource(contentId) {
        const requestBody = {
          request: {
            content: {
              publisher: "CBSE",
              lastPublishedBy: "99606810-7d5c-4f1f-80b0-36c4a0b4415d"
            }
          }
        };
        const optionVal = {
          url: `${contentProxyUrl}/content/content/v1/publish/${contentId}`,
          body: requestBody,
          json: true,
          headers: getHeaders(req)
        };
        from(request.post(optionVal)).subscribe(
          response => {
            res.status(200);
            res.json({
                "id": "api.worksheet.create",
                "ver": "1.0",
                'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
                "params": {
                  "resmsgid": uuid(),
                  "status": "successful"
                },
                "responseCode": "OK" ,
                "result": {
                    content_id: response.result.content_id,
                    publishStatus: `Publish Operation for Content Id '${
                    response.result.content_id
                  }' Started Successfully!`
                }
              });
          },
          err => {
            console.log(
              "error",
              _.get(err, "error.params.errmsg") || "content publish failed"
            );
            res.json({
                "id": "api.worksheet.create",
                "ver": "1.0",
                'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
                "params": {
                    "resmsgid": uuid(),
                    "status": "failed",
                    "err": "error",
                    "errmsg": _.get(err, "error.params.errmsg") || "content creation failed"
                },
                "responseCode": "FAILED" ,
                "result": {}
            });
          }
        );
      }
    }
  );

  app.post("/worksheet/v3/update/:id",
    bodyParser.urlencoded({
      extended: true
    }),
    bodyParser.json(),
    async (req, res) => {
      const options = {
        method: "PATCH",
        url: `${contentProxyUrl}/action/content/v3/update/${req.params.id}`,
        headers: getHeaders(req),
        json: true
      };
      const updatedBody = resourceCreationHelper.getECMLJSON(options.headers, req.body.request.content.questions)
      const versionKey = resourceCreationHelper.getContentVersion(options.headers, req.params.id)
      const remainingUpdateBody = _.omit(req.body.request.content, 'questions')
      console.log(remainingUpdateBody);
      forkJoin([updatedBody, versionKey])
        .subscribe(response => {
          updateResource(response[0], response[1].result.content)
        }, err => {
            res.status(err.statusCode);
            res.json(err.error);
        })
        const questions = [];
      _.forEach(_.get(req.body.request.content, "questions"), value => {
        questions.push({ identifier: value });
      });
      function updateResource(body, contentMeta) {
        options.headers["x-authenticated-userid"] = contentMeta.createdBy;
        options.body = {
            request : {
                content: {
                    questions: questions,
                    body: JSON.stringify(body.theme),
                    versionKey: contentMeta.versionKey,
                    ...remainingUpdateBody
                }
            }
        }
        from(request.patch(options)).subscribe(
          response => {
            if (response.responseCode === "OK" && response.result.node_id !== undefined) {
                publishResource(response.result.node_id);
            }
          },
          err => {
            console.log(
              "error",
              _.get(err, "error.params.errmsg") || "content publish failed"
            );
            res.status(400);
            res.json({
                "id": "api.worksheet.update",
                "ver": "1.0",
                'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
                "params": {
                    "resmsgid": uuid(),
                    "status": "failed",
                    "err": "error",
                    "errmsg": _.get(err, "error.params.errmsg") || "content update failed"
                },
                "responseCode": "FAILED" ,
                "result": {}
            });
          }
        )
      }

      function publishResource(contentId){
        const requestBody = {
            request: {
              content: {
                publisher: "CBSE",
                lastPublishedBy: "99606810-7d5c-4f1f-80b0-36c4a0b4415d"
              }
            }
          };
          const optionVal = {
            url: `${contentProxyUrl}/content/content/v1/publish/${contentId}`,
            body: requestBody,
            json: true,
            headers: getHeaders(req)
          };

          from(request.post(optionVal)).subscribe(
            response => {
              res.status(200);
              res.json({
                  "id": "api.worksheet.update",
                  "ver": "1.0",
                  'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
                  "params": {
                    "resmsgid": uuid(),
                    "status": "successful"
                  },
                  "responseCode": "OK" ,
                  "result": {
                      content_id: response.result.content_id,
                    publishStatus: `Publish Operation for Content Id '${
                      response.result.content_id
                    }' Started Successfully!`
                  }
                });
            },
            err => {
              console.log(
                "error",
                _.get(err, "error.params.errmsg") || "content publish failed"
              );
              res.json({
                  "id": "api.worksheet.update",
                  "ver": "1.0",
                  'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
                  "params": {
                      "resmsgid": uuid(),
                      "status": "failed",
                      "err": "error",
                      "errmsg": _.get(error, "error.params.errmsg") || "content creation failed"
                  },
                  "responseCode": "FAILED" ,
                  "result": {}
              });
            }
          );
      }
    }
  )
};
