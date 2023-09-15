import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';
import {
  OrgDetailsService,
  FormService,
  ManagedUserService
} from './../../../core/services';
import { ToasterService } from '@sunbird/shared';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { zip } from 'rxjs';
// import { LanguageDropdownComponent } from './../../../core/components/language-dropdown/language-dropdown.component';

@Component({
  selector: 'compass-header',
  templateUrl: './compass-header.component.html',
  styleUrls: ['./compass-header.component.scss']
})
export class CompassHeaderComponent implements OnInit {
  @Input() tenantInfo: any;
  @Input() userService: any;
  @Input() resourceService: any;
  @Input() userProfile: any;
  @Input() guestUser: any;
  @Input() hrefPath: any;
  @Input() avatarConfig: any;
  @Input() layoutConfiguration;

  @Output() clearFilters = new EventEmitter();
  @Output() navigateToHome = new EventEmitter();
  @Output() toggleSidebar = new EventEmitter<any>();

  languages: Array<any>;
  isLanguageDropdown: boolean = true;
  languageFormQuery = {
    formType: 'content',
    formAction: 'search',
    filterEnv: 'resourcebundle'
  };
  isValidCustodianOrgUser = true;
  userListToShow = [];
  totalUsersCount: number;

  constructor(private managedUserService: ManagedUserService, public orgDetailsService: OrgDetailsService,
    public formService: FormService, public router: Router, public toasterService: ToasterService) { }

  ngOnInit(): void {
    if (this.userService.loggedIn) {
      this.userService.userData$.subscribe((user: any) => {
        if (user && !user.err) {
          this.managedUserService.fetchManagedUserList();
          this.fetchManagedUsers();
          this.userProfile = user.userProfile;
          this.getLanguage(this.userService.channel);
          this.isCustodianOrgUser();
        }
      });
    } else {
      this.orgDetailsService.orgDetails$.pipe(first()).subscribe((data) => {
        if (data && !data.err) {
          this.getLanguage(data.orgDetails.hashTagId);
        }
      });
    }
  }

  private isCustodianOrgUser() {
    this.orgDetailsService.getCustodianOrgDetails().subscribe((custodianOrg) => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        this.isValidCustodianOrgUser = true;
      } else {
        this.isValidCustodianOrgUser = false;
      }
    });
  }

  fetchManagedUsers() {
    const requests = [this.managedUserService.managedUserList$];
    if (_.get(this.userService, 'userProfile.managedBy')) {
      requests.push(this.managedUserService.getParentProfile());
    }
    zip(...requests).subscribe((data) => {
      let userListToProcess = _.get(data[0], 'result.response.content');
      if (data && data[1]) {
        userListToProcess = [data[1]].concat(userListToProcess);
      }
      const processedUserList = this.managedUserService.processUserList(userListToProcess, this.userService.userid);
      this.userListToShow = processedUserList.slice(0, 2);
      this.totalUsersCount = processedUserList && Array.isArray(processedUserList) && processedUserList.length;
    }, (err) => {
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
    }
    );
  }

  navigateToHomepage() {
    this.navigateToHome.emit('');
  }

  clearCache() {
    this.clearFilters.emit('');
  }
  toggleSideMenu(boo) {
    this.toggleSidebar.emit(boo)
  }

  getLanguage(channelId) {
    const formServiceInputParams = {
      formType: this.languageFormQuery.formType,
      formAction: this.languageFormQuery.formAction,
      contentType: this.languageFormQuery.filterEnv
    };
    this.formService.getFormConfig(formServiceInputParams, channelId).subscribe((data: any) => {
      this.languages = data[0].range;
      // Displaying only 2 languages in dropdown
      this.languages = this.languages.slice(0, 2);
      this.isLanguageDropdown = data[0].visible
      // console.log('PPPP', this.languages)
      // console.log('PPPP', this.isLanguageDropdown)
    }, (err: any) => {
      this.languages = [{ 'value': 'en', 'label': 'English', 'dir': 'ltr', 'accessibleText': 'English' }];
    });
  }

  /**
 * Used to hide language change dropdown for specific route
 * restrictedRoutes[] => routes where do not require language change dropdown
 */
  showLanguageDropdown() {
    const restrictedRoutes = ['workspace', 'manage'];
    let showLanguageChangeDropdown = true;
    for (const route of restrictedRoutes) {
      if (this.router.isActive(route, false)) {
        showLanguageChangeDropdown = false;
        break;
      }
    }
    return showLanguageChangeDropdown;
  }
}
