/**
 * @file        - Google Cloud Provider (GCP) Storage Service
 * @exports     - `GCPStorageService`
 * @since       - 5.0.1
 * @version     - 1.0.0
 * @implements  - BaseStorageService
 */

const BaseStorageService  = require('./BaseStorageService');
const envHelper           = require('./../../helpers/environmentVariablesHelper');
const storageLogger       = require('./storageLogger');
const { Storage }         = require('@google-cloud/storage');
const { logger }          = require('@project-sunbird/logger');
const async               = require('async');
const _                   = require('lodash');
const dateFormat          = require('dateformat');
const uuidv1              = require('uuid/v1');
const reports             = envHelper.sunbird_gcloud_reports + '/';


const _storage = new Storage({
  credentials: {
    client_email: envHelper.sunbird_gcloud_client_email,
    private_key: envHelper.sunbird_gcloud_private_key?.toString()
  },
  projectId: envHelper.sunbird_gcloud_projectId
});


class GCPStorageService extends BaseStorageService {

  fileExists(bucketName, fileToGet, prefix = '', cb) {
    const file = _storage.bucket(bucketName).file(prefix + fileToGet);
    logger.info({ msg: 'GCLOUD__StorageService - fileExists called for bucketName ' + bucketName + ' for file ' + prefix + fileToGet });
    file.exists((err, exists) => {
      if (err) cb(err);
      if (exists) {
        cb(null, exists);
      } else {
        cb(null, null);
      }
    });
  }

  /**
   * @description                     - Provides a stream to read from a storage
   * @param {string} bucketName       - Bucket name or folder name in storage service
   * @param {string} fileToGet        - File path in storage service
   */
  fileReadStream(bucketName = undefined, fileToGet = undefined) {
    return async (req, res, next) => {
      let bucketName = envHelper.sunbird_gcloud_bucket_name;
      let fileToGet = reports + req.params.slug.replace('__', '\/') + '/' + req.params.filename;
      logger.info({ msg: 'GCLOUD__StorageService - fileReadStream called for bucketName ' + bucketName + ' for file ' + fileToGet });

      if (fileToGet.includes('.json')) {
        try {
          const file = _storage.bucket(bucketName).file(fileToGet)
          const fileStream = file.createReadStream();
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
          streamToString(fileStream).then((data) => {
            res.end(data);
          }).catch((err) => {
            if (_.get(err, 'code') === 404) {
              storageLogger.s404(res, 'GCLOUD__StorageService : readStream error - Error ' +
                _.get(err, 'code') + ' ' + _.get(err, 'message'), '', _.get(err, 'message'));
            } else {
              storageLogger.s500(res, 'GCLOUD__StorageService : readStream client send error - Error 500', err, 'Failed to display blob');
            }
          });
        } catch (error) {
          storageLogger.s500(res, 'GCLOUD__StorageService : readStream client send error - Error 500', error, 'Failed to display blob');
        }
      } else {
        this.fileExists(bucketName, fileToGet, '', (error, fileExists) => {
          if (error) {
            storageLogger.s404(res, 'GCLOUD__StorageService : readStream_fileExists error - Error 404', error, 'File does not exists');
          } else if (fileExists) {
            this.getSharedAccessSignature(bucketName, fileToGet, '', undefined, (err, presignedURL) => {
              if (err) {
                storageLogger.s500(res, 'GCLOUD__StorageService : readStream_getSharedAccessSignature - Error 500. Failed to get shared access signature',
                  err, err);
              } else {
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
                logger.info({ msg: 'GCLOUD__StorageService - readStream_getSharedAccessSignature called for bucketName ' + bucketName + ' for file ' + fileToGet });
                res.status(200).send(this.apiResponse(response));
              }
            });
          } else {
            storageLogger.s500(res, 'GCLOUD__StorageService : readStream_fileExists error - Error 500. Failed to fetch or File does not exists',
              error, 'Failed to fetch or File does not exists');
          }
        });
      }
    }
  }

  async getSharedAccessSignature(bucketName, fileToGet, prefix = '', expiresIn, cb) {
    let expiryDate;
    if (!expiresIn) {
      let startDate = new Date();
      expiryDate = new Date(startDate);
      expiryDate.setMinutes(startDate.getMinutes() + 3600);
      startDate.setMinutes(startDate.getMinutes() - 3600);
    } else {
      expiryDate = expiresIn;
    }
    const _config = { action: 'read', expires: expiryDate };
    const file = _storage.bucket(bucketName).file(prefix + fileToGet);
    await file.getSignedUrl(_config).then((signedUrl) => {
      cb(null, signedUrl && signedUrl.length > 0 && signedUrl[0]);
    }).catch((err) => cb(_.get(err, 'message')));
  }

  getFileProperties() {
    return (req, res, next) => {
      const bucketName = envHelper.sunbird_gcloud_bucket_name;
      const fileToGet = JSON.parse(req.query.fileNames);
      logger.info({ msg: 'GCLOUD__StorageService - getFileProperties called for bucketName ' + bucketName + ' for file ' + fileToGet });
      const responseData = {};
      if (Object.keys(fileToGet).length > 0) {
        const getBlogRequest = [];
        for (const [key, file] of Object.entries(fileToGet)) {
          const req = {
            bucketName: bucketName,
            file: file,
            reportname: key
          };
          getBlogRequest.push(
            async.reflect((callback) => {
              this.getBlobProperties(req, callback)
            })
          );
        }
        async.parallel(getBlogRequest, (err, results) => {
          if (results) {
            results.forEach(blob => {
              if (blob.error) {
                responseData[(_.get(blob, 'error.reportname'))] = blob.error
              } else {
                responseData[(_.get(blob, 'value.reportname'))] = {
                  lastModified: _.get(blob, 'value.updated'),
                  reportname: _.get(blob, 'value.reportname'),
                  statusCode: _.get(blob, 'value.statusCode'),
                  fileSize: _.get(blob, 'value.size')
                }
              }
            });
            const finalResponse = {
              responseCode: "OK",
              params: {
                err: null,
                status: "success",
                errmsg: null
              },
              result: responseData
            }
            res.status(200).send(this.apiResponse(finalResponse))
          }
        });
      }
    }
  }

  async getBlobProperties(request, callback) {
    const file = _storage.bucket(request.bucketName).file(reports + request.file);
    file.getMetadata((err, metadata, resp) => {
      if (err) {
        logger.error({ msg: 'GCLOUD__StorageService : getBlobProperties_getMetadata client send error - Error 500 Failed to check file exists', err: err });
        callback(err);
      } else if (_.get(resp, 'statusCode') == 404) {
        logger.error({ msg: 'GCLOUD__StorageService : getBlobProperties_getMetadata error - Error with status code 404. File does not exists - ' + request.file, error: resp });
        callback({ msg: _.get(resp, 'statusMessage'), statusCode: _.get(resp, 'statusCode'), filename: request.file, reportname: request.reportname })
      } else if (_.get(resp, 'statusCode') == 200) {
        metadata.reportname = request.reportname;
        metadata.statusCode = 200;
        logger.info({
          msg: 'GCLOUD__StorageService : getBlobProperties_getMetadata success with status code 200. File exists - ' +
            request.file, statusCode: _.get(resp, 'statusCode')
        });
        callback(null, metadata);
      } else {
        logger.error({ msg: 'GCLOUD__StorageService : getBlobProperties_getMetadata client send error - Error 500 Failed to check file exists' });
        callback(true);
      }
    });
  }

  async getFileAsText(container = undefined, fileToGet = undefined, callback) {
    const bucketName = envHelper.sunbird_gcloud_bucket_name;
    logger.info({ msg: 'GCLOUD__StorageService : getFileAsText called for bucket ' + bucketName + ' container ' + container + ' for file ' + fileToGet });
    const file = _storage.bucket(bucketName).file(container + fileToGet);
    const fileStream = file.createReadStream();
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
    streamToString(fileStream).then((data) => {
      callback(null, data);
    }).catch((err) => {
      if (_.get(err, 'code') === 404) {
        callback(err);
        logger.error({ msg: 'GCLOUD__StorageService : getFileAsText error - Error ' + _.get(err, 'code') + ' ' + _.get(err, 'message') });
      } else {
        callback({ err: 'Failed to display blob', statusCode: 500 })
        logger.error({ msg: 'GCLOUD__StorageService : getFileAsText client send error - Error 500. Failed to display blob' });
      }
    });
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

module.exports = GCPStorageService;