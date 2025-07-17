import { Injectable } from '@angular/core';
import { CsModule } from '@project-fmps/client-services';
import { CsClientStorage } from '@project-fmps/client-services/core/cs-client-storage';
import { UserService } from '@sunbird/core';

@Injectable({
  providedIn: 'root'
})
export class CsLibInitializerService {
  fingerprintInfo = '';

  constructor(public userService: UserService) { }

  private _initializeCs() {
    this.fingerprintInfo = document?.getElementById('deviceId')?(<HTMLInputElement>document?.getElementById('deviceId'))?.value:'';
    if (!CsModule.instance.isInitialised) {
       // Singleton initialised or not
        CsModule.instance.init({
          core: {
              httpAdapter: 'HttpClientBrowserAdapter',
              global: {
                  channelId: this.userService.hashTagId, // required
                  producerId: this.userService.appId, // required
                  deviceId: this.fingerprintInfo // required
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
              updateGroupGuidelinesApiPath: '/learner/group/membership/v1'
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
              apiPath: '/discussion',
            },
            contentServiceConfig: {
              hierarchyApiPath: '/learner/questionset/v2',
              questionListApiPath: '/api/question/v2'
            },
            notificationServiceConfig: {
              apiPath: '/learner/notification/v1/feed'
            },
            certificateServiceConfig: {
              apiPath: 'v1/certs/search',
              rcApiPath: 'api/rc/certificate/v1'
            },
            frameworkServiceConfig: {
              apiPath: '/api/framework/v1'
            }
          }
      },
      null,
      new class implements CsClientStorage {
        setItem(key: string, value: string): Promise<void> {
          return new Promise(resolve => {
            resolve(localStorage.setItem(key, value));
          });
        }
        getItem(key: string): Promise<string | undefined> {
          return new Promise(resolve => {
            const value = localStorage.getItem(key);
            console.log('localStorage.getItem(key)', value);
            resolve(value);
          });
        }
    }
      );
    }
  }
  initializeCs() {
    this._initializeCs();
  }
}
