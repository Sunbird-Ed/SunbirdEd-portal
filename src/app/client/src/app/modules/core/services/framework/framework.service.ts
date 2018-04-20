import { Injectable } from '@angular/core';
import { UserService } from './../user/user.service';
import { ContentService } from './../content/content.service';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse,
  Framework, FrameworkCategorie, IUserData, IUserProfile
} from '@sunbird/shared';
import { SearchParam } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { concat } from 'rxjs/operator/concat';
import { CacheService } from 'ng2-cache-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class FrameworkService {
  /**
   * Reference of user service.
   */
  public user: UserService;

  /**
   * Reference of content service.
   */
  public content: ContentService;

  /**
   * Reference of config service
   */
  public config: ConfigService;
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
     * Default method of OrganisationService class
     *
     * @param {UserService} user user service reference
     * @param {ContentService} content content service reference
     * @param {ConfigService} config config service reference
     */
  constructor(user: UserService, content: ContentService, config: ConfigService,
    private _cacheService: CacheService,
    public toasterService: ToasterService, public resourceService: ResourceService) {
    this.user = user;
    this.content = content;
    this.config = config;
  }

  public initialize() {
    /**
    * Call User service to get user data
    */
    this.user.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.hashTagId = this.userProfile.rootOrg.hashTagId;
          if (this.isApiCall === true) {
            this.getFramework();
          }
        } else if (user && user.err) {
          this.toasterService.error(this.resourceService.messages.emsg.m0005 || 'Something went wrong, please try again later...');
        }
      });
  }
  /**
* getdefaultFramework   .
*
*/
  public getFramework(): void {
    const channelOptions = {
      url: this.config.urlConFig.URLS.CHANNEL.READ + '/' + this.hashTagId
    };
    this.content.get(channelOptions).subscribe(
      (data: ServerResponse) => {
        const defaultFramework = data.result.channel.defaultFramework;
        this.defaultFramework = data.result.channel.defaultFramework;
        this._frameworkData$.next({ err: null, framework: this.defaultFramework, frameworkdata: null });
        if (defaultFramework) {
          this.getFrameworkCategories(defaultFramework);
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
  public getFrameworkCategories(defaultFramework): void {
    const frameworkOptions = {
      url: this.config.urlConFig.URLS.FRAMEWORK.READ + '/' + defaultFramework
    };
    this.content.get(frameworkOptions).subscribe(
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
