import { Injectable } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
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
                  // bearerToken: string; // optional                  }
              }
            }
          },
          services: {
              groupServiceConfig: {
                apiPath: '/learner/group/v1',
                dataApiPath: '',
              },
              userServiceConfig: {
                apiPath: '/learner/user/v2',
              }
          }
      });
    }
  }
  initializeCs() {
    this.userService.userData$.pipe(first())
    .subscribe(() => this._initializeCs());
  }
}
