/**
 * @file        - Entry file referencing Storage Service
 * @description - Entry file referencing Storage Service
 * @exports     - `AzureStorageService` and `AWSStorageService`
 * @since       - 5.0.0
 * @version     - 1.0.0
 */

let AzureStorageService = require('./AzureStorageService');
let AWSStorageService   = require('./AWSStorageService');

exports.AzureStorageService = new AzureStorageService();
exports.AWSStorageService   = new AWSStorageService();