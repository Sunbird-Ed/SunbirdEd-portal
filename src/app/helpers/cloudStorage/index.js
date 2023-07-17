
/**
 * @file        - Entry file referencing Storage Service
 * @description - Entry file referencing Storage Service
 * @exports     - `AzureStorageService`, `AWSStorageService` and `GoogleStorageService`
 * @author      - RAJESH KUMARAVEL
 * @since       - 5.0.1
 * @updated     - 5.1.0
 * @version     - 1.0.0
 */

const cloudService  = require('client-cloud-services');
const envHelper     = require('../../helpers/environmentVariablesHelper');


/**
 * Based on Environment Cloud Provider value
 * Export respective Storage Service
 */
  let cloudConfig = {
      identity: envHelper.cloud_private_storage_accountname,
      credential: envHelper.cloud_private_storage_secret,
     
      reportsContainer: envHelper.cloud_storage_privatereports_bucketname,
      labelsContainer: envHelper.cloud_storage_resourceBundle_bucketname,

      region: envHelper.cloud_private_storage_region||null,
      // containerName: envHelper.sunbird_aws_bucket_name||null,
      cloud_private_storage_project: envHelper.cloud_private_storage_project||null,


    };
    let cloudClient = cloudService.init();
    const cloudStorage = new cloudClient(cloudConfig);
    exports.CLOUD_CLIENT = cloudStorage;

