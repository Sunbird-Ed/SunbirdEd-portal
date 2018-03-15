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
    pathRewrite: {'/userId': '/781c21fc-5054-4ee0-9a02-fbb1006a4fdd'}
  }
]
module.exports = PROXY_CONFIG
