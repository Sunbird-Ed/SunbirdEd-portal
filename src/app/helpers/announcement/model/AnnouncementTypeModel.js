let BaseModel = require('./BaseModel.js')
let Joi = require('joi')

class AnnouncementTypeModel extends BaseModel {
    constructor() {
        super()
        this.apiSchema = {}
        this.modelSchema = Joi.object().keys({
            rootorgid: Joi.string().required(),
            sourceid: Joi.string().required(),
            createddate: Joi.string().required(),
            typename: Joi.string().required(),
            status: Joi.string()
        })
    }
    validateApi(obj) {
        return this.validate(obj, this.apiSchema)
    }
    validateModel(obj) {
        return this.validate(obj, this.modelSchema)
    }
}
module.exports = new AnnouncementTypeModel()