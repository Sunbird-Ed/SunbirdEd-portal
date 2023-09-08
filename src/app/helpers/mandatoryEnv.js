const env = process.env;
//Environment
const SB_DOMAIN = 'https://staging.sunbirded.org';

let mandEnvVariables = {
    // ######## Mandatory  variables for Anonymous User #######

    // Device register API for anonymous users
    sunbird_anonymous_register_token: env.sunbird_anonymous_register_token || '',
    // Fallback token for device register API for `anonymous` users
    sunbird_anonymous_default_token: env.sunbird_anonymous_default_token || '',

    // ######## Mandatory variables for `logged-in` User ########

    // The env variable is used to set the config of kong to enable the  logged-in feature
    sunbird_loggedin_device_register_api: env.sunbird_loggedin_device_register_api || '',
    // Fallback token for device register API for `logged-in` users
    sunbird_logged_default_token: env.sunbird_logged_default_token || '',
    // Device register API for logged-in users
    sunbird_loggedin_register_token: env.sunbird_loggedin_register_token || '',

    // ######## Configuration of Cloud Service Provider  ########

    // Cloud Account Key
    cloud_private_storage_secret: env.cloud_private_storage_secret || '',
}
module.exports = mandEnvVariables;