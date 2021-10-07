// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { CsModule } from '@project-sunbird/client-services';

declare const __karma__: any;
declare const require: any;
const tags = __karma__.config.args[0];

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// then we find all the tests.
const filterRegExp = (tags) ? new RegExp(tags, 'g') : /\.spec\.ts$/,
  context = require.context('./app/', true, /\.spec\.ts$/),
  specFiles = context.keys().filter(path => filterRegExp.test(path));
// and load the modules.
specFiles.map(context);

if (!CsModule.instance.isInitialised) {
  // Singleton initialised or not
  CsModule.instance.init({
    core: {
      httpAdapter: 'HttpClientBrowserAdapter',
      global: {
        channelId: 'channelId', // required
        producerId: 'ntp.sunbird.portal', // required
        deviceId: 'e6733e8f13baae78077f91d3810fd8285' // required
      },
      api: {
        host: document.location.origin, // default host
        authentication: {
          // userToken: string; // optional
          // bearerToken: string; // optional
        }
      }
    },
    services: {
      groupServiceConfig: {
        apiPath: '/learner/group/v1',
        dataApiPath: '/learner/data/v1/group',
      },
      userServiceConfig: {
        apiPath: '/learner/user/v2',
      },
      formServiceConfig: {
        apiPath: '/learner/data/v1/form',
      },
      courseServiceConfig: {
        apiPath: '/learner/course/v1',
        certRegistrationApiPath: '/learner/certreg/v2/certs'
      },
      discussionServiceConfig: {
        apiPath: '/discussion'
      },
      contentServiceConfig: {
        hierarchyApiPath: '/learner/questionset/v1',
        questionListApiPath: '/api/question/v1'
      },
      notificationServiceConfig: {
        apiPath: '/learner/notification/v1/feed'
      }
    }
  });
}

