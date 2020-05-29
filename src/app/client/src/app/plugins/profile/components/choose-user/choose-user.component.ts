import {Component, OnInit} from '@angular/core';
import {ManagedUserService, UserService} from '@sunbird/core';
import {
  ConfigService,
  ResourceService,
  ServerResponse,
  ToasterService,
  InterpolatePipe, IUserData, NavigationHelperService
} from '@sunbird/shared';
import {ActivatedRoute, Router} from '@angular/router';
import {IInteractEventEdata, TelemetryService} from '@sunbird/telemetry';
import {environment} from '@sunbird/environment';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-choose-user',
  templateUrl: './choose-user.component.html',
  styleUrls: ['./choose-user.component.scss']
})
export class ChooseUserComponent implements OnInit {

  constructor(public userService: UserService, public navigationhelperService: NavigationHelperService,
              public toasterService: ToasterService, public router: Router,
              public resourceService: ResourceService, private telemetryService: TelemetryService,
              private configService: ConfigService, private managedUserService: ManagedUserService,
              public activatedRoute: ActivatedRoute) {
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

  ngOnInit() {
    this.getManagedUserList();
    this.telemetryImpressionEvent();
    this.setTelemetryData();
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
    const userId = _.get(event, 'data.data.identifier');
    _.forEach(this.userList, (userData, index) => {
      this.userList[index].selected = userData.identifier === userId;
    });
  }

  setTelemetryData() {
    this.submitInteractEdata = {
      id: 'submit-choose-managed-user',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
    };
  }

  getManagedUserList() {
    const fetchManagedUserRequest = {
      request: {
        filters: {
          managedBy: this.userService.userid
        }
      }
    };
    this.managedUserService.fetchManagedUserList(fetchManagedUserRequest).subscribe((data: ServerResponse) => {
        const managedUserList = _.get(data, 'result.response.content') || [];
        _.forEach(managedUserList, (userData) => {
          userData.title = userData.firstName;
          userData.initial = userData.firstName && userData.firstName[0];
          userData.selected = false;
          this.userList.push(userData);
        });
      }, (err) => {
        this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
      }
    );
  }

  switchUser() {
    const userId = this.selectedUser.identifier;
    const initiatorUserId = this.userService.userid;
    this.telemetryService.start(this.getStartEventData(userId, initiatorUserId));
    this.managedUserService.initiateSwitchUser(userId).subscribe((data) => {
      this.managedUserService.setSwitchUserData(userId, _.get(data, 'result.sessionIdentifier'));
        this.userService.userData$.subscribe((user: IUserData) => {
          if (user && !user.err && user.userProfile.userId === userId) {
            this.telemetryService.setInitialization(false);
            this.telemetryService.initialize(this.getTelemetryContext());
            this.router.navigate(['/resources']);
            this.toasterService.custom({
              message: this.managedUserService.getMessage(_.get(this.resourceService, 'messages.imsg.m0095'),
                this.selectedUser.firstName),
              class: 'sb-toaster sb-toast-success sb-toast-normal'
            });
            this.telemetryService.end(this.getEndEventData(userId, initiatorUserId));
          }
        });
      }, (err) => {
        this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
      }
    );
  }

  getStartEventData(userId, initiatorUserId) {
    return {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          id: 'initiator-id',
          type: initiatorUserId
        }, {
          id: 'managed-user-id',
          type: userId
        }]
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: 'switch-user'
      }
    };
  }

  getEndEventData(userId, initiatorUserId) {
    return {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          id: 'initiator-id',
          type: initiatorUserId
        }, {
          id: 'managed-user-id',
          type: userId
        }]
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: 'switch-user'
      }
    };
  }

  navigateToCreateUser() {
    this.router.navigate(['/profile/create-managed-user']);
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
}
