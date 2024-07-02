
/**
 * @file        - Entry file referencing Storage Service
 * @description - Entry file referencing Storage Service
 * @exports     - `AzureStorageService`, `AWSStorageService`, `GoogleStorageService` and `OCIStorageService`
 * @author      - RAJESH KUMARAVEL
 * @since       - 5.0.1
 * @updated     - 6.0.0
 * @version     - 2.0.0
 */

const cloudService = require('client-cloud-services');
const envHelper = require('../../helpers/environmentVariablesHelper');
const cloudProvider = envHelper?.sunbird_cloud_storage_provider;

/**
 * Based on Environment Cloud Provider value
 * Export respective Storage Service
 */
if (!cloudProvider) throw new Error("Cloud Storage Service - Provider is not initialized");
let cloudConfig = {
  provider: envHelper?.sunbird_cloud_storage_provider,
  identity: envHelper?.cloud_private_storage_accountname,
  credential: envHelper?.cloud_private_storage_secret,
  privateObjectStorage: envHelper?.cloud_storage_privatereports_bucketname,
  publicObjectStorage: envHelper?.cloud_storage_resourceBundle_bucketname,
  region: envHelper?.cloud_private_storage_region,
  projectId: envHelper?.cloud_private_storage_project,
  endpoint: envHelper?.cloud_private_storage_endpoint
};

let cloudClient = cloudService.init(cloudConfig);
exports.CLOUD_CLIENT = cloudClient;
