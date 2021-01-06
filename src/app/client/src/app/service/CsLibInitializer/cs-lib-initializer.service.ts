import { Injectable } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
import { CsClientStorage } from '@project-sunbird/client-services/core/cs-client-storage';
import { UserService } from '@sunbird/core';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CsLibInitializerService {
  fingerprintInfo = '';

  constructor(public userService: UserService) { }

  private _initializeCs() {
    this.fingerprintInfo = (<HTMLInputElement>document.getElementById('deviceId')).value;
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
                apiPath: '/discussion'
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
    this.userService.userData$.pipe(first())
    .subscribe(() => this._initializeCs());
  }
}
