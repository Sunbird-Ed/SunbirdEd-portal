const _ = require('lodash');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const request = require('request-promise');
const envHelper = require('./../helpers/environmentVariablesHelper.js')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')

module.exports = (app) => {

  app.post('/learner/fuzzy/search', bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }), 
    async (req, res, next) => {
      console.log('------------req.body-------', req.body);
      if(req.body.identifier !== '9663119919'){
        res.status(404).send({
          'id': 'api.fuzzy.search',
          'ver': '1.0',
          'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
          'params': {
            'resmsgid': uuidv1(),
            'status': 'SUCCUSS',
          },
          'responseCode': 'OK',
          'result': {
          }
        })
        return;
      }
      res.send({
        'id': 'api.fuzzy.search',
        'ver': '1.0',
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'params': {
          'resmsgid': uuidv1(),
          'status': 'SUCCUSS',
        },
        'responseCode': 'OK',
        'result': {
          account: [{
            id: '123',
            phone: '96******12',
            email: 'an*****@gmail.com'
          },
          {
            id: '124',
            phone: '96******13',
            email: 'am*****@gmail.com'
          }]
        }
      })
  })
  app.all('/learner/otp/v1/generate', bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }), 
  async (req, res, next) => {
    res.send({"id":"api.otp.generate","ver":"v1","ts":"2019-07-28 11:19:59:890+0000","params":{"resmsgid":null,"msgid":"9314e099-914e-6a3a-5844-4d833a2d91b7","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"response":"SUCCESS"}})
  })
  app.all('/learner/otp/v1/verify', bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }), 
  async (req, res, next) => {
    console.log('req.body req.body', req.body);
    if(req.body.request.id == '124') {
      res.status(404).send({"id":"api.otp.generate","ver":"v1","ts":"2019-07-28 11:19:59:890+0000","params":{"resmsgid":null,"msgid":"9314e099-914e-6a3a-5844-4d833a2d91b7","err":null,"status":"success","errmsg":null},"responseCode":"Failure","result":{"response":"Failure"}})
      return;
    }
    res.send({"id":"api.otp.generate","ver":"v1","ts":"2019-07-28 11:19:59:890+0000","params":{"resmsgid":null,"msgid":"9314e099-914e-6a3a-5844-4d833a2d91b7","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"response":"SUCCESS"}})
  })
}