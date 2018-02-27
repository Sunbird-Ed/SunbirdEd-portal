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
    pathRewrite: {'/userId': '/874ed8a5-782e-4f6c-8f36-e0288455901e'}
  }
]
module.exports = PROXY_CONFIG
