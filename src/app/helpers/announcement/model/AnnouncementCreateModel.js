/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

let BaseModel = require('./BaseModel.js')
let Joi = require('joi')

class AnnouncementModel extends BaseModel {
    constructor() {
        super()
        this.modelSchema = Joi.object().keys({
            id: Joi.string().required(),
            userid: Joi.string().required(), // part of primary key
            sourceid: Joi.string().required(), // part of primary key
            createddate: Joi.string().required(), // part of primary key
            details: Joi.object().min(1), // any key/value with string
            links: Joi.array().items(Joi.string()),
            attachments: Joi.array().items(Joi.string()),
            target: Joi.object().min(1).required(), // TODO: add validation for target format
            status: Joi.string(),
            sentcount: Joi.number(),
            priority: Joi.string(),
            expiry: Joi.string(),
            updateddate: Joi.string()
        })
        this.apiSchema = Joi.object().keys({
            request: Joi.object().keys({
                sourceId: Joi.string().required(),
                createdBy: Joi.string().required(),
                title: Joi.string().required(),
                from: Joi.string().required(),
                type: Joi.string().required(),
                description: Joi.string(),
                target: Joi.object().min(1).required(),
                links: Joi.array().items(Joi.string()),
                attachments: Joi.array().items(Joi.string())
            }).required()
        })
    }

    validateApi(obj) {
        return this.validate(obj, this.apiSchema)
    }
    validateModel(obj) {
        return this.validate(obj, this.modelSchema)
    }

}
module.exports = new AnnouncementModel()