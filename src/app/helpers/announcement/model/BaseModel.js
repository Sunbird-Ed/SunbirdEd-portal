const _ = require('lodash')
let Joi = require('joi')
class Model {
    validate(object = {}, schema = {}) {
        let validation = Joi.validate(object, schema, {
            abortEarly: true
        })
        if (validation.error != null) {
            let messages = []
            _.forEach(validation.error.details, (error, index) => {
                messages.push({
                    field: error.path[0],
                    description: error.message
                })
            })
            return {
                error: messages,
                isValid: false,
                object: object
            }
        }
        return {
            isValid: true,
            object: object
        }
    }

}
module.exports = Model