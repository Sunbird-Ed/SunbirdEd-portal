import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoursesService, ManagedUserService, UserService} from '@sunbird/core';
import {
  ConfigService,
  ResourceService,
  ToasterService,
  IUserData, NavigationHelperService, UtilService
} from '@sunbird/shared';
import {ActivatedRoute, Router} from '@angular/router';
import {IInteractEventEdata, TelemetryService} from '@sunbird/telemetry';
import {environment} from '@sunbird/environment';
import * as _ from 'lodash-es';
import {zip} from 'rxjs';

@Component({
  selector: 'app-choose-user',
  templateUrl: './choose-user.component.html',
  styleUrls: ['./choose-user.component.scss']
})
export class ChooseUserComponent implements OnInit, OnDestroy {

  constructor(public userService: UserService, public navigationhelperService: NavigationHelperService,
              public toasterService: ToasterService, public router: Router, private utilService: UtilService,
              public resourceService: ResourceService, private telemetryService: TelemetryService,
              private configService: ConfigService, private managedUserService: ManagedUserService,
              public activatedRoute: ActivatedRoute, public courseService: CoursesService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  userList = [];
  instance: string;
  memberCardConfig = {
    size: this.configService.constants.SIZE.MEDIUM,
    isSelectable: true,
    view: this.configService.constants.VIEW.HORIZONTAL,
    isBold: false
  };
  selectedUser: any;
  submitInteractEdata: IInteractEventEdata;
  userDataSubscription: any;

  ngOnInit() {
    this.navigationhelperService.setNavigationUrl();
    this.userDataSubscription = this.userService.userData$.subscribe((user: IUserData) => {
      this.getManagedUserList();
    });
    this.telemetryImpressionEvent();
    this.setTelemetryData();
  }

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  switchUser() {
    const userId = this.selectedUser.identifier;
    const switchUserRequest = {
      userId: this.selectedUser.identifier,
      isManagedUser: this.selectedUser.managedBy ? true : false
    };
    this.managedUserService.initiateSwitchUser(switchUserRequest).subscribe((data) => {
        this.managedUserService.setSwitchUserData(userId, _.get(data, 'result.userSid'));
        this.userService.userData$.subscribe((user: IUserData) => {
          if (user && !user.err && user.userProfile.userId === userId) {
            this.courseService.getEnrolledCourses().subscribe((enrolledCourse) => {
              this.telemetryService.setInitialization(false);
              this.telemetryService.initialize(this.getTelemetryContext());
              this.toasterService.custom({
                message: this.managedUserService.getMessage(_.get(this.resourceService, 'messages.imsg.m0095'),
                  this.selectedUser.firstName),
                class: 'sb-toaster sb-toast-success sb-toast-normal'
              });
              setTimeout(() => {
                this.utilService.redirect('/resources');
              }, 5100);
            });
          }
        });
      }, (err) => {
        this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
      }
    );
  }

  telemetryImpressionEvent() {
    this.telemetryService.impression({
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.activatedRoute.snapshot.data.telemetry.uri,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    });
  }

  selectUser(event) {
    this.selectedUser = _.get(event, 'data.data');
    if (this.selectedUser.selected) {
      this.selectedUser = null;
    }
    const userId = _.get(event, 'data.data.identifier');
    _.forEach(this.userList, (userData, index) => {
      if (userData.identifier === userId) {
        this.userList[index].selected = !userData.selected;
      } else {
        this.userList[index].selected = userData.identifier === userId;
      }
    });
  }

  setTelemetryData() {
    this.submitInteractEdata = {
      id: 'submit-choose-managed-user',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
    };
  }

  navigateToCreateUser() {
    this.router.navigate(['/profile/create-managed-user']);
  }

  getManagedUserList() {
    const requests = [this.managedUserService.managedUserList$];
    if (this.userService.userProfile.managedBy) {
      requests.push(this.managedUserService.getParentProfile());
    }
    zip(...requests).subscribe((data) => {
      let userListToProcess = _.get(data[0], 'result.response.content');
      if (data[1]) {
        userListToProcess = [data[1]].concat(userListToProcess);
      }
      this.userList = this.managedUserService.processUserList(userListToProcess, this.userService.userid);
    }, (err) => {
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
    });
  }

  getTelemetryContext() {
    const userProfile = this.userService.userProfile;
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    return {
      userOrgDetails: {
        userId: userProfile.userId,
        rootOrgId: userProfile.rootOrgId,
        rootOrg: userProfile.rootOrg,
        organisationIds: userProfile.hashTagIds
      },
      config: {
        pdata: {
          id: this.userService.appId,
          ver: version,
          pid: this.configService.appConfig.TELEMETRY.PID
        },
        endpoint: this.configService.urlConFig.URLS.TELEMETRY.SYNC,
        apislug: this.configService.urlConFig.URLS.CONTENT_PREFIX,
        host: '',
        uid: userProfile.userId,
        sid: this.userService.sessionId,
        channel: _.get(userProfile, 'rootOrg.hashTagId'),
        env: 'home',
        enableValidation: environment.enableTelemetryValidation,
        timeDiff: this.userService.getServerTimeDiff
      }
    };
  }

  closeSwitchUser() {
    this.navigationhelperService.navigateToLastUrl();
  }
}
