const Application = require('spectron').Application;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const electron = require('electron');
const path = require('path');
import {config} from './test.spec'

global.before(() => {
  chai.should();
  chai.use(chaiAsPromised);
});

let app = null;

  export const startApp = async () => {
    if (app) {
      return Promise.resolve(app);
    }
    app = await new Application({
        path: electron,
        args: [path.join(__dirname, '..'), path.join(__dirname, 'data', config.content.import.file)],
        env: {
            ELECTRON_ENABLE_LOGGING: true,
            ELECTRON_ENABLE_STACK_DUMPING: true,
            NODE_ENV: "testing"
        },
        startTimeout: 20000,
        chromeDriverLogPath: 'chromedriverlog.txt'
    }).start();
    await app.client.pause(10000);
    await app.client.switchWindow(config.title)
    chaiAsPromised.transferPromiseness = app.transferPromiseness;
    return app;
  }

  export const stopApp =  async () => {
    if (app && app.isRunning()) {
      let pid =  await app.mainProcess.pid();
      console.log("PID: ", pid)
      await app.stop()
    }
  } 
