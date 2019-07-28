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
}