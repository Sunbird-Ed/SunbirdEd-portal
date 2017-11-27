let BaseModel = require('./BaseModel.js')
let Joi = require('joi')

class MetricsModel extends BaseModel {
    constructor() {
        super()
        this.modelSchema = Joi.object().keys({
            id: Joi.string().required(),
            userid: Joi.string().required(),
            announcementid: Joi.string().required(),
            activity: Joi.string().required(),
            channel: Joi.string(),
            createddate: Joi.string().required()
        })
        this.apiSchema = Joi.object().keys({
            request: Joi.object().keys({
                userId: Joi.string().required(),
                announcementId: Joi.string().required(),
                channel: Joi.string().required()
            }).required()
        }), {
            abortEarly: false
        }
    }
    validateApi(obj) {
    	console.log("metrics validation coming")
        return this.validate(obj, this.apiSchema)
    }
    validateModel(obj) {
        return this.validate(obj, this.modelSchema)
    }
}
module.exports = new MetricsModel()