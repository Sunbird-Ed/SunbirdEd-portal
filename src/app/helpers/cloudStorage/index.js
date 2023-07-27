
/**
 * @file        - Entry file referencing Storage Service
 * @description - Entry file referencing Storage Service
 * @exports     - `AzureStorageService`, `AWSStorageService` and `GoogleStorageService`
 * @author      - RAJESH KUMARAVEL
 * @since       - 5.0.1
 * @updated     - 5.1.0
 * @version     - 1.0.0
 */

const cloudService = require('azure-cloud-services');
const cloudHelper = require('./helperUtils')

/**
 * Based on Environment Cloud Provider value
 * Export respective Storage Service
 */
let config = cloudHelper.mapCloudConfig(cloudService.config());
console.log("Cloud config is", config)
let cloudClient = cloudService.init();
const cloudStorage = new cloudClient(config);
exports.CLOUD_CLIENT = cloudStorage;

