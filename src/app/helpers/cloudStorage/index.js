
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
const cloudProvider = envHelper.sunbird_cloud_storage_provider;

/**
 * Based on Environment Cloud Provider value
 * Export respective Storage Service
 */
if (!cloudProvider) throw new Error("Cloud Storage Service - Provider is not initialized");
switch (cloudProvider) {
  case 'azure':
    let azureConfig = {
      identity: envHelper.sunbird_azure_account_name,
      credential: envHelper.sunbird_azure_account_key,
      reportsContainer: envHelper.sunbird_azure_report_container_name,
      labelsContainer: envHelper.sunbird_azure_resourceBundle_container_name
    };
    let azureClient = cloudService.init('azure');
    const azureStorage = new azureClient(azureConfig);
    exports.CLOUD_CLIENT = azureStorage;
    break;
  case 'aws':
    let awsConfig = {
      identity: envHelper.sunbird_aws_access_key,
      credential: envHelper.sunbird_aws_secret_key,
      region: envHelper.sunbird_aws_region,
      containerName: envHelper.sunbird_aws_bucket_name,
      reportsContainer: envHelper.sunbird_aws_reports,
      labelsContainer: envHelper.sunbird_aws_labels
    };
    let awsClient = cloudService.init('aws');
    const awsStorage = new awsClient(awsConfig);
    exports.CLOUD_CLIENT = awsStorage;
    break;
  case 'gcloud':
    let gcpConfig = {
      identity: envHelper.sunbird_gcloud_client_email,
      credential: envHelper.sunbird_gcloud_private_key,
      projectId: envHelper.sunbird_gcloud_projectId,
      containerName: envHelper.sunbird_gcloud_bucket_name,
      reportsContainer: envHelper.sunbird_gcloud_reports,
      labelsContainer: envHelper.sunbird_gcloud_labels
    };
    let gcpClient = cloudService.init('gcloud');
    const gcpStorage = new gcpClient(gcpConfig);
    exports.CLOUD_CLIENT = gcpStorage;
    break;
  default:
    throw new Error("Cloud Storage Service - Provider is not initialized or supported");
    break;
}
