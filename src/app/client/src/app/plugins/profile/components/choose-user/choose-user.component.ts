import {Component, OnInit} from '@angular/core';
import {ProfileService} from './../../services';
import {ManagedUserService, UserService} from '@sunbird/core';
import {
  ConfigService,
  ResourceService,
  ServerResponse,
  ToasterService,
  InterpolatePipe, IUserData, NavigationHelperService
} from '@sunbird/shared';
import {ActivatedRoute, Router} from '@angular/router';
import {TelemetryService} from '@sunbird/telemetry';
import {environment} from '@sunbird/environment';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-choose-user',
  templateUrl: './choose-user.component.html',
  styleUrls: ['./choose-user.component.scss']
})
export class ChooseUserComponent implements OnInit {

  constructor(public profileService: ProfileService, public userService: UserService,
              public toasterService: ToasterService, public router: Router,
              public resourceService: ResourceService, private telemetryService: TelemetryService,
              private configService: ConfigService, private managerUserService: ManagedUserService,
              public activatedRoute: ActivatedRoute, public navigationhelperService: NavigationHelperService) {
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

  ngOnInit() {
    this.getManagedUserList();
    this.telemetryImpressionEvent();
  }

  telemetryImpressionEvent() {
    this.telemetryService.impression({
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
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

  getManagedUserList() {
    const fetchManagedUserRequest = {
      request: {
        filters: {
          managedBy: this.userService.userid
        }
      }
    };
    this.managerUserService.fetchManagedUserList(fetchManagedUserRequest).subscribe((data: ServerResponse) => {
        const managedUserList = _.get(data, 'result.response.content') || [];
        _.forEach(managedUserList, (userData) => {
          userData.title = userData.firstName;
          userData.initial = userData.firstName[0];
          userData.selected = false;
          this.userList.push(userData);
        });
      }, (err) => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      }
    );
  }

  switchUser() {
    const userId = this.selectedUser.identifier;
    this.managerUserService.initiateSwitchUser(userId).subscribe((data) => {
        // @ts-ignore
        document.getElementById('userId').value = userId;
        this.userService.setUserId(userId);
        this.userService.initialize(true);
        this.userService.userData$.subscribe((user: IUserData) => {
          if (user && !user.err && user.userProfile.userId === userId) {
            this.telemetryService.initialize(this.getTelemetryContext());
            this.router.navigate(['/resources']);
            const filterPipe = new InterpolatePipe();
            let errorMessage =
              filterPipe.transform(this.resourceService.messages.imsg.m0095, '{instance}', this.instance);
            errorMessage =
              filterPipe.transform(errorMessage, '{userName}', this.selectedUser.firstName);
            this.toasterService.info(errorMessage);
          }
        });
      }, (err) => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      }
    );
  }

  navigateToCreateUser() {
    this.router.navigate(['/profile/create-user']);
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
