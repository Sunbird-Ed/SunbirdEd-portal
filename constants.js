'use strict'

const path = require('path')

module.exports = {
    /**
     * The const of Authentication end point url.
     *
     * @const {string}
     */
    authEndpointUrl: '',
    /**
     * The const of API end point URL
     *
     * @const {string}
     * @example https://dev.sunbirded.org/action
     */
    // apiEndpointUrl: process.env.API_END_POINT_API,
    // apiEndpointUrl:"https://dev.sunbirded.org/action",

    // assessmentApiEndpointUrl: process.env.ASSESSMENT_API_END_POINT,
    // assessmentApiEndpointUrl: "https://dev.sunbirded.org/action",
    // kp_search_service_base_path : "https://dev.sunbirded.org/action",
    kp_learning_service_base_path : process.env.kp_learning_service_base_path,
    kp_search_service_base_path : process.env.kp_search_service_base_path,
    kp_assessment_service_base_path:process.env.kp_assessment_service_base_path,
    kp_content_service_base_path:process.env.kp_content_service_base_path,

    /**
     * The const of client ID
     *
     * @const {string}
     */
    clientId: '',

    /**
     * The const of username
     *
     * @const {string}
     */
    username: '',

    /**
     * The const of Password.
     *
     * @const {string}
     */
    password: '',

    /**
     * The const of grant type.
     *
     * @const {string}
     */
    grant_type: '',

    /**
     * The input csv file path
     *
     * @const {string}
     */
    csv_file_rath: path.join(__dirname, 'question_ids.csv'),
    /**
     * Final report of migration output csv file path
     *
     * @const {string}
     */
    result_csv_file_rath: path.join(__dirname, 'reports', 'results.csv'),
    /**
     * The output csv file path
     *
     * @const {string}
     */
    content_csv_file_rath: path.join(__dirname, 'reports', 'contents.csv'),

    publish_result_csv_file_rath: path.join(__dirname, 'reports', 'publish_content.csv'),

    failed_itemset_to_content_result_csv_file_rath: path.join(__dirname, 'reports', 'failed_itemset_to_content.csv'),
    passed_itemset_to_content_result_csv_file_rath: path.join(__dirname, 'reports', 'passed_itemset_to_content.csv'),
    itemset_creation_result_csv_file_rath : path.join(__dirname, 'reports', 'itemset_creation.csv'),
    ECML_content_identifier_path: path.join(__dirname, 'reports', 'ECMLContents.csv'),
    
    content_csv_folder_rath: path.join(__dirname, 'reports', 'inputContentList'),
    /**
     * batch size for API request , it executes no of API request concurrently
     *
     * @const {number}
     */
    batch_size: 1,
    /**
     * Time delay between each batch
     *
     * @const {number}
     */
    delay_between_request: 500,

    /**
     * boolean value if access token required or not
     *
     * @const {boolean}
     */
    access_token_required: false,





}