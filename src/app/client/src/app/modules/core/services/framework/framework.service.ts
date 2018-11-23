import { Injectable } from '@angular/core';
import { UserService } from './../user/user.service';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse,
  Framework, IUserData, IUserProfile, FrameworkData
} from '@sunbird/shared';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import { PublicDataService } from './../public-data/public-data.service';
import * as _ from 'lodash';

@Injectable()
export class FrameworkService {
  /**
   * Reference of user service.
   */
  public userService: UserService;
  /**
   * Reference of config service
   */
  public configService: ConfigService;
  /**
  * defaultFramework
  */
  public defaultFramework: string;
  /**
  * defaultFramework
  */
  public frameworkCategories: any;
  /**
   * BehaviorSubject Containing framework data.
   */

  private _frameworkData:  FrameworkData = {};
  /**
 * isApiCall is used to set flag as true to call api.
 */
  private isApiCall: Boolean = true;
  /**
   * BehaviorSubject Containing framework data.
   */
  private _frameworkData$ = new BehaviorSubject<Framework>(undefined);
  /**
   * Read only observable Containing framework data.
   */
  public readonly frameworkData$: Observable<Framework> = this._frameworkData$.asObservable()
  .pipe(skipWhile(data => data === undefined || data === null));
  /**
 * userProfile is of type userprofile interface
 */
  public userProfile: IUserProfile;
  /**
   * public hashTagId
   */
  public hashTagId: any;
  /**
   * Reference of public data service
   */
  public publicDataService: PublicDataService;

  /**
     * Default method of OrganisationService class
     *
     * @param {UserService} user user service reference
     * @param {ContentService} content content service reference
     * @param {ConfigService} config config service reference
     */
  constructor(userService: UserService, configService: ConfigService,
    private _cacheService: CacheService,
    public toasterService: ToasterService, public resourceService: ResourceService, publicDataService: PublicDataService) {
    this.userService = userService;
    this.configService = configService;
    this.publicDataService = publicDataService;
  }

  public initialize(framewrok?: string) {
    if (framewrok) {
      if (this._frameworkData && !_.get( this._frameworkData , framewrok) ) {
        this.getFrameworkCategories(framewrok);
      }
    } else  {
      if (this._frameworkData && !_.get( this._frameworkData , 'defaultFramework') ) {
        this.userService.userData$.subscribe(
          (user: IUserData) => {
            if (user && !user.err) {
              this.hashTagId = this.userService.hashTagId;
              this.getFramework();
            }
          });
      }
    }
  }
  /**
* getdefaultFramework   .
*
*/
  public getFramework(): void {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.CHANNEL.READ + '/' + this.hashTagId
    };
    this.publicDataService.get(channelOptions).subscribe(
      (data: ServerResponse) => {
        this.defaultFramework = data.result.channel.defaultFramework;
        this._frameworkData$.next({ err: null,  frameworkdata: null });
        if (this.defaultFramework) {
          this.getFrameworkCategories();
        }
      },
      (err: ServerResponse) => {
        this._frameworkData$.next({ err: err, frameworkdata: null });
      }
    );
  }
  /**
* getFramework data   .
*
*/
  public getFrameworkCategories(framework ?: string): void {
    const requestFramework = framework  ? framework : this.defaultFramework;
    const frameworkOptions = {
      url: this.configService.urlConFig.URLS.FRAMEWORK.READ + '/' + requestFramework
    };
    this.publicDataService.get(frameworkOptions).subscribe(
      (frameworkData: ServerResponse) => {
        this.isApiCall = false;
        if (framework) {
          this._frameworkData[framework] = frameworkData.result.framework;
        } else {
          this._frameworkData['defaultFramework']  = frameworkData.result.framework;
        }
        this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
      },
      (err: ServerResponse) => {
       this._frameworkData$.next({ err: err, frameworkdata: null });
      }
    );
  }
}
