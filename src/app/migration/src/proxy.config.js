const PROXY_CONFIG = [
  {
    context: [
      '/resourcebundles/**',
      '/learner/**',
      '/content/**',
      '/announcement/v1/**'
    ],
    target: 'http://localhost:3000',
    secure: false,
    logLevel: 'debug',
    pathRewrite: {'/userId': '/3becd312-737c-4192-8c69-c01146b8a80e'}
  }
]
module.exports = PROXY_CONFIG
