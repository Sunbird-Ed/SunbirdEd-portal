const env = process.env;
let mandEnvVariables = {
    // ######## Mandatory  variables for Anonymous User #######

    // Device register API for anonymous users
    sunbird_anonymous_register_token: env.sunbird_anonymous_register_token || env.sunbird_default_token,
    // Fallback token for device register API for `anonymous` users
    sunbird_anonymous_default_token: env.sunbird_anonymous_default_token || env.sunbird_default_token,

    // ######## Mandatory variables for `logged-in` User ########

    // Fallback token for device register API for `logged-in` users
    sunbird_logged_default_token: env.sunbird_logged_default_token || env.sunbird_default_token,
    // Device register API for logged-in users
    sunbird_loggedin_register_token: env.sunbird_loggedin_register_token || env.sunbird_default_token,

    // ######## Configuration of Cloud Service Provider  ########

    // Cloud Account Key
    cloud_private_storage_secret: env.cloud_private_storage_secret || env.cloud_private_storage_secret,
    // Cloud Private Storage Account Name
    cloud_private_storage_accountname: env.cloud_private_storage_accountname || env.cloud_private_storage_accountname,
    // Cloud Storage Provider
    sunbird_cloud_storage_provider: env.sunbird_cloud_storage_provider || env.sunbird_cloud_storage_provider,
}
module.exports = mandEnvVariables;