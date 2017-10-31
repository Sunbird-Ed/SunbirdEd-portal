var HttpStatus = require('http-status-codes')
const API_ID = 'api.notifications'

module.exports = {
  success (res, id, result, code) {
    res.status(code || HttpStatus.OK)
    res.send({
      'id': API_ID + '.' + id,
      'ver': '1.0',
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'params': {
        'resmsgid': uuidv1(),
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': result
    })
    res.end()
  },
  error (res, message, code) {
    res.status(code || HttpStatus.NOT_FOUND)
    res.send({
      'id': API_ID + '.error',
      'ver': '1.0',
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'params': {
        'resmsgid': uuidv1(),
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': message
      },
      'responseCode': 'ERROR',
      'result': {}
    })
    res.end()
  }
}
