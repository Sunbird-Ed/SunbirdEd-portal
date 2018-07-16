import { Injectable } from '@angular/core';
import { UserService } from './../user/user.service';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse,
  Framework, FrameworkCategorie, IUserData, IUserProfile
} from '@sunbird/shared';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { CacheService } from 'ng2-cache-service';
import { PublicDataService } from './../public-data/public-data.service';
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

  private _frameworkData: FrameworkCategorie;
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
  public readonly frameworkData$: Observable<Framework> = this._frameworkData$.asObservable();
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

  public initialize(hashTagId?: string) {
    if (hashTagId === '' || hashTagId === undefined) {
      this.userService.userData$.subscribe(
        (user: IUserData) => {
          if (user && !user.err) {
            this.hashTagId = this.userService.hashTagId;
            if (this.isApiCall === true) {
              this.getFramework();
            }
          }
        });
    } else {
      this.hashTagId = hashTagId;
      if (this.isApiCall === true) {
        this.getFramework();
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
        // this._frameworkData$.next({ err: null, framework: this.defaultFramework, frameworkdata: null });
        if (this.defaultFramework) {
          this.getFrameworkCategories();
        }
      },
      (err: ServerResponse) => {
        this._frameworkData$.next({ err: err, framework: null, frameworkdata: null });
      }
    );
  }
  /**
* getFramework data   .
*
*/
  public getFrameworkCategories(): void {
    const frameworkOptions = {
      url: this.configService.urlConFig.URLS.FRAMEWORK.READ + '/' + this.defaultFramework
    };
    this.publicDataService.get(frameworkOptions).subscribe(
      (frameworkData: ServerResponse) => {
        this.isApiCall = false;
        this._frameworkData = frameworkData.result.framework.categories;
        this._frameworkData$.next({ err: null, framework: this.defaultFramework, frameworkdata: this._frameworkData });
      },
      (err: ServerResponse) => {
        this._frameworkData$.next({ err: err, framework: null, frameworkdata: null });
      }
    );
  }
}
