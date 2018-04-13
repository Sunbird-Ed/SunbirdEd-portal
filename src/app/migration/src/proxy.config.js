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
    pathRewrite: {'/userId': '/68777b59-b28b-4aee-88d6-50d46e4c3509'}
  }
]
module.exports = PROXY_CONFIG
