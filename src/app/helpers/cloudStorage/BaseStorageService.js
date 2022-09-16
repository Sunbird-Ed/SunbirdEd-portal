/**
 * @file        - Base Cloud Storage Service
 * @description - Provides the interface and base implementation of StorageService
 * @module      - BaseStorageService
 * @exports     - `BaseStorageService`
 * @since       - 5.0.0
 * @version     - 1.0.0
 */

class BaseStorageService {

  /**
   * @description                     - Download file from storage service
   * @throws                          - Throws Exception if method is not invoked without declaration
   * @param  {String} container       - Container name or folder name in storage service
   * @param  {String} fileToDownload  - File path in storage service
   * @param  {Boolean} isDirectory    - default `false`
   */
  downloadFile(container, fileToDownload, isDirectory = false) {
    throw new Error('BaseStorageService :: downloadFile() must be implemented');
  }

  /**
   * @description                     - Retrieves a blob or container URL
   * @throws                          - Throws Exception if method is not invoked without declaration
   * @param {string} container        - Container name or folder name in storage service
   * @param {string} filePath         - File path in storage service
   */
  getURI(container, filePath) {
    throw new Error('BaseStorageService :: getURI() must be implemented');
  }

  /**
   * @description                     - Provides a stream to read from a storage
   * @throws                          - Throws Exception if method is not invoked without declaration
   * @param {string} container        - Container name or folder name in storage service
   * @param {string} filePath         - File path in storage service
   */
  fileReadStream(container, filePath) {
    throw new Error('BaseStorageService :: fileReadStream() must be implemented');
  }

  /**
   * @description                     - Checks whether or not a blob exists on the storage service
   * @throws                          - Throws Exception if method is not invoked without declaration
   * @param {string} container        - Container name or folder name in storage service
   * @param {string} filePath         - File path in storage service
   */
  fileExists(container, filePath) {
    throw new Error('BaseStorageService :: fileExists() must be implemented');
  }

  /**
   * @description                     - Retrieves a shared access signature token or signed URL
   * @throws                          - Throws Exception if method is not invoked without declaration
   * @param {string} container        - Container name or folder name in storage service
   * @param {string} filePath         - File path in storage service
   */
  getSharedAccessSignature(container, filePath) {
    throw new Error('BaseStorageService :: getSharedAccessSignature() must be implemented');
  }

  /**
   * @description                     - Get all user-defined metadata, standard HTTP properties, and system properties for the blob
   * @throws                          - Throws Exception if method is not invoked without declaration
   * @param {string} container        - Container name or folder name in storage service
   * @param {string} filePath         - File path in storage service
   */
  getFileProperties(container, filePath) {
    throw new Error('BaseStorageService :: getFileProperties() must be implemented');
  }

  /**
   * @description                     - Downloads a blob / file into a text string
   * @throws                          - Throws Exception if method is not invoked without declaration
   * @param {string} container        - Container name or folder name in storage service
   * @param {string} filePath         - File path in storage service
   * @param { function } callback     - Callback function
   */
  getFileAsText(container, filePath, callback) {
    throw new Error('BaseStorageService :: getFileAsText() must be implemented');
  }

}

module.exports = BaseStorageService;