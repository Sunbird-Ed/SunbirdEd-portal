/**
 * @file        - AWS Storage Service
 * @exports     - `AWSStorageService`
 * @since       - 5.0.0
 * @version     - 1.0.0
 */

const BaseStorageService  = require('./BaseStorageService');
const envHelper           = require('./../../helpers/environmentVariablesHelper');
const { logger }          = require('@project-sunbird/logger');
const _                   = require('lodash');
const dateFormat          = require('dateformat');
const uuidv1              = require('uuid/v1');
const reports             = envHelper.sunbird_aws_reports + '/';
const region              = envHelper.sunbird_aws_region.toString();
const storageLogger       = require('./storageLogger');
const { getSignedUrl }    = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const client              = new S3Client({ region });

class AWSStorageService extends BaseStorageService {

  /**
   * @description                     - Function to generate AWS command for an operation
   * @param  {string} bucketName      - AWS bucket name
   * @param  {string} fileToGet       - AWS File to fetch
   * @param  {string} prefix          - `Optional` - Prefix for file path
   * @returns                         - AWS Command to be executed by SDK
   */
  getAWSCommand(bucketName, fileToGet, prefix = '') {
    return new GetObjectCommand({ Bucket: bucketName, Key: prefix + fileToGet });
  }

  /**
   * @description                     - Function to check whether file exists in specified bucket or not
   * @param  {string} bucketName      - AWS bucket name
   * @param  {string} fileToGet       - AWS File to check
   * @param  {string} prefix          - `Optional` - Prefix for file path
   * @param  {function} cb            - Callback function
   */
  async fileExists(bucketName, fileToGet, prefix = '', cb) {
    const params = { Bucket: bucketName, Key: prefix + fileToGet };
    const command = new HeadObjectCommand(params);
    await client.send(command).then((resp) => {
      cb(null, resp)
    }).catch((err) => {
      cb(err);
    });
  }

  /**
   * @description                     - Provides a stream to read from a storage
   * @param {string} bucketName       - Bucket name or folder name in storage service
   * @param {string} fileToGet        - File path in storage service
   */
  fileReadStream(bucketName = undefined, fileToGet = undefined) {
    return async (req, res, next) => {
      let bucketName = envHelper.sunbird_aws_bucket_name;
      let fileToGet = req.params.slug.replace('__', '\/') + '/' + req.params.filename;
      logger.info({ msg: 'AWSStorageService - fileReadStream called for bucketName ' + bucketName + ' for file ' + fileToGet });

      if (fileToGet.includes('.json')) {
        const streamToString = (stream) =>
          new Promise((resolve, reject) => {
            const chunks = [];
            stream.on("data", (chunk) => chunks.push(chunk));
            stream.on("error", (err) => {
              reject(err)
            });
            stream.on("end", () => {
              resolve(Buffer.concat(chunks).toString("utf8"))
            });
          });
        await client.send(this.getAWSCommand(bucketName, fileToGet, reports)).then((resp) => {
          streamToString(_.get(resp, 'Body')).then((data) => {
            res.end(data);
          }).catch((err) => {
            storageLogger.s500(res, 'AWSStorageService : readStream error - Error 500', err, 'Failed to execute readStream');
          });
        }).catch((error) => {
          if (_.get(error, '$metadata.httpStatusCode') == 404) {
            storageLogger.s404(res, 'AWSStorageService : readStream client send error - Error with status code 404', error, 'File not found');
          } else {
            storageLogger.s500(res, 'AWSStorageService : readStream client send error - Error 500', error, 'Failed to display blob');
          }
        });
      } else {
        this.fileExists(bucketName, fileToGet, reports, async (error, resp) => {
          if (_.get(error, '$metadata.httpStatusCode') == 404) {
            storageLogger.s404(res, 'AWSStorageService : fileExists error - Error with status code 404', error, 'File does not exists');
          } else if (_.get(resp, '$metadata.httpStatusCode') == 200) {
            const command = this.getAWSCommand(bucketName, fileToGet, reports);
            // `expiresIn` - The number of seconds before the presigned URL expires
            const presignedURL = await getSignedUrl(client, command, { expiresIn: 3600 });
            const response = {
              responseCode: "OK",
              params: {
                err: null,
                status: "success",
                errmsg: null
              },
              result: {
                'signedUrl': presignedURL
              }
            }
            res.status(200).send(this.apiResponse(response));
          } else {
            storageLogger.s500(res, 'AWSStorageService : fileExists client send error - Error 500', '', 'Failed to check file exists');
          }
        });
      }
    }
  }

  apiResponse({ responseCode, result, params: { err, errmsg, status } }) {
    return {
      'id': 'api.report',
      'ver': '1.0',
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'params': {
        'resmsgid': uuidv1(),
        'msgid': null,
        'status': status,
        'err': err,
        'errmsg': errmsg
      },
      'responseCode': responseCode,
      'result': result
    }
  }
}

module.exports = AWSStorageService;