import * as express from 'express'
import * as bodyParser from 'body-parser'

const expressApp  = express()
expressApp.use(bodyParser.json({limit: '50mb'}))

export { expressApp }