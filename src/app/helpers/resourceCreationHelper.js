const envHelper = require("./../helpers/environmentVariablesHelper.js");
const _ = require("lodash");
const resourceCreationData = require("../helpers/resourceCreationData.js");
const dateFormat = require("dateformat");
const request = require("request-promise");
const uuidv1 = require("uuid/v1");
const contentProxyUrl = envHelper.CONTENT_PROXY_URL;
const Observable = require("rxjs/Observable").Observable;
const { of, forkJoin } = require("rxjs");
const { mergeMap, map, catchError, tap } = require("rxjs/operators");
const { from } = require("rxjs");

function getECMLJSON(headers, collections) {
  // console.log(collections)
  const theme = _.cloneDeep(resourceCreationData.themeObject);
  const stage = _.cloneDeep(resourceCreationData.stageObject);
  const questionSet = _.cloneDeep(resourceCreationData.questionSetObject);
  stage.id = uuidv1();
  theme.startStage = stage.id;
  questionSet.id = uuidv1();
  questionSet.data.__cdata.push({ identifier: questionSet.id });
  const questionSetConfigCdata =
    resourceCreationData.questionSetConfigCdataObject;
  let questionSetAttribution = [];
  let questionSetAuthor = [];
  const questionSetMeta = {};
  return of(collections)
    .pipe(
      mergeMap(collectionIds => {
        if (collectionIds.length > 0) {
          return forkJoin(
            _.map(collectionIds, collectionId => {
              const req = {
                url: `${contentProxyUrl}/action/assessment/v3/items/read/${collectionId}`,
                headers: headers,
                json: true
              };
              return from(request.get(req)).pipe(
                map(res => {
                  const question = _.cloneDeep(
                    resourceCreationData.questionObject
                  );
                  question.id = uuidv1();
                  const questionConfigCdata = {};
                  questionConfigCdata.question = _.get(
                    res,
                    "result.assessment_item.body"
                  );
                  const media = _.map(
                    _.get(res, "result.assessment_item.media"),
                    mediaObj => {
                      delete mediaObj.baseUrl;
                      return mediaObj;
                    }
                  );
                  questionConfigCdata.media = media;
                  if (
                    _.get(res, "result.assessment_item.type") === "reference"
                  ) {
                    questionConfigCdata.solution = _.get(
                      res,
                      "result.assessment_item.solutions"
                    );
                  }
                  if (_.get(res, "result.assessment_item.type") === "mcq") {
                    questionSetConfigCdata.show_feedback = true;
                    questionSetConfigCdata.shuffle_questions = false;
                    questionConfigCdata.responseDeclaration = _.get(
                      res,
                      "result.assessment_item.responseDeclaration"
                    );
                  }
                  questionSetAttribution = questionSetAttribution.concat(
                    _.get(res, "result.assessment_item.organisation")
                  );
                  questionSetAuthor.push(
                    _.get(res, "result.assessment_item.creator")
                  );
                  questionSetCategory = _.get(res, "result.assessment_item.category");
                  questionSetConfigCdata.total_items = collections.length;
                  questionConfigCdata.options =
                    res.result.assessment_item.options || [];
                  question.config.__cdata.metadata = {};
                  const blacklist = [
                    "media",
                    "options",
                    "body",
                    "question",
                    "editorState",
                    "solutions"
                  ];
                  question.config.__cdata.max_score =
                    _.get(res, "result.assessment_item.maxScore") || 1;
                  question.config.__cdata.metadata = _.cloneDeep(
                    _.omit(res.result.assessment_item, blacklist)
                  );
                  questionConfigCdata.questionCount = 0;
                  question.data.__cdata = JSON.stringify(questionConfigCdata);
                  question.config.__cdata = JSON.stringify(
                    question.config.__cdata
                  );
                  return question;
                }),
                catchError(err => of(err))
              );
            })
          );
        } else {
          console.log("Telemetry error has to log - collection length is 0");
        }
      })
    )
    .pipe(
      map(questions => {
        const questionMedia = _.flattenDeep(
          _.map(questions, question => {
            return JSON.parse(question.data.__cdata).media
              ? JSON.parse(question.data.__cdata).media
              : [];
          })
        );
        theme.manifest.media = _.uniqBy(
          _.concat(theme.manifest.media, questionMedia),
          "id"
        );
        questionSetAttribution = _.compact(_.uniqBy(questionSetAttribution));
        questionSetAuthor = _.uniqBy(questionSetAuthor).join(", ");
        questionSet.config.__cdata = JSON.stringify(questionSetConfigCdata);
        questionSet.data.__cdata = JSON.stringify(questionSet.data.__cdata);
        questionSet["org.ekstep.question"] = questions;
        stage["org.ekstep.questionset"].push(questionSet);
        theme.stage.push(stage);
        return {
          theme: {theme},
          questionSetMeta: {
            questionSetAttribution: questionSetAttribution,
            questionSetAuthor: questionSetAuthor,
            questionSetCategory: questionSetCategory
          }
        };
      })
    );
}

function getContentVersion(headers, contentId){
    const req = {
      url: `${contentProxyUrl}/content/content/v1/read/${contentId}?mode=edit&fields=versionKey,createdBy`,
      headers: headers,
      json: true
    };
    return from(request.get(req))
}


module.exports.getECMLJSON = getECMLJSON;
module.exports.getContentVersion = getContentVersion;
