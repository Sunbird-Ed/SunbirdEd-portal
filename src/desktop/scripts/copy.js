const fse = require("fs-extra")


Promise.all([
fse.copy('./loading', './app_dist/loading'),
fse.copy('./scripts', './app_dist/scripts'),
fse.copy('./public', './app_dist/public'),
fse.copyFile('./package.json', './app_dist/package.json'),
fse.copy('./OpenRAP/dist/project-sunbird-OpenRAP-1.0.2.tgz', 'app_dist/OpenRAP/dist/project-sunbird-OpenRAP-1.0.2.tgz'),
fse.copy('./logo.png', 'app_dist/logo.png'),
fse.copy('./../app/resourcebundles/json/', './app_dist/openrap-sunbirded-plugin/data/resourceBundles'),
])