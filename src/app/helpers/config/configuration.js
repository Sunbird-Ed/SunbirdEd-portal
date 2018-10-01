
let configData = {}

__get = function(configKey){
    return configData[configKey]
}

__set = function(configKey,configValue){
    configData[configKey] = configValue
}

module.exports = {
    get: __get,
    set: __set
}
