const env = process.env

/**
 * @param  {object} cloudConfig - config object
 */
const mapCloudConfig = (cloudConfig) => {
    Object.keys(cloudConfig).forEach((item) => {
        cloudConfig[item] = env[item]
    })
    return cloudConfig;
}
module.exports = { mapCloudConfig };