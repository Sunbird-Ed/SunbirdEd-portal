import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormService, UserService } from './../../services';
import * as _ from 'lodash-es';
import { LayoutService, ResourceService, UtilService,IUserData} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TelemetryService } from '@sunbird/telemetry';


@Component({
  selector: 'app-content-type',
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss'],
})
export class ContentTypeComponent implements OnInit, OnDestroy {
  @Output() closeSideMenu = new EventEmitter<any>();
  @Input() layoutConfiguration;
  contentTypes;
  selectedContentType;
  isDesktopApp = false;
  public unsubscribe$ = new Subject<void>();
  subscription: any;
  userType:any;
  constructor(
    public formService: FormService,
    public resourceService: ResourceService,
    public router: Router,
    public userService: UserService,
    private telemetryService: TelemetryService,
    public activatedRoute: ActivatedRoute,
    public layoutService: LayoutService,
    private utilService: UtilService,
  ) {
    this.subscription = this.utilService.currentRole.subscribe(async (result) => {
      if (result) {
        this.userType = result;
        this.makeFormChange();
      }
    });
  }


  ngOnInit() {
    this.getContentTypes();
    this.isDesktopApp = this.utilService.isDesktopApp;
    this.layoutService.updateSelectedContentType
      .subscribe((data) => {
        this.updateSelectedContentType(data);
      });
  }


  setContentTypeOnUrlChange() {
    combineLatest(this.activatedRoute.queryParams, this.activatedRoute.params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.setSelectedContentType(this.router.url, result[0], result[1]);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  generateTelemetry(contentType) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env') || 'content-type',
        cdata: []
      },
      edata: {
        id: contentType,
        type: 'click',
        pageid: this.router.url || 'content-type'
      }
    };
    this.telemetryService.interact(interactData);
  }

  showContentType(data) {
    this.generateTelemetry(data.contentType);
    let params = _.cloneDeep(this.activatedRoute.snapshot.queryParams);

    // All and myDownloads Tab should not carry any filters from other tabs / user can apply fresh filters
    if (data.contentType === 'mydownloads' || data.contentType === 'all') {
      params = _.omit(params, ['board', 'medium', 'gradeLevel', 'subject', 'se_boards', 'se_mediums', 'se_gradeLevels', 'se_subjects']);
    }

    if (this.userService.loggedIn) {
      this.router.navigate([data.loggedInUserRoute.route],
        { queryParams: { ...params, selectedTab: data.loggedInUserRoute.queryParam } });
    } else {
      !data.isLoginMandatory ?
        this.router.navigate([data.anonumousUserRoute.route],
          { queryParams: { ...params, selectedTab: data.anonumousUserRoute.queryParam } }) : window.location.href = data.loggedInUserRoute.route;
    }
  }

  setSelectedContentType(url, queryParams, pathParams) {
    if (url.indexOf('play') >= 0) {
      this.selectedContentType = queryParams.contentType ? queryParams.contentType.toLowerCase() : null;
    } else if (url.indexOf('explore-course') >= 0 || url.indexOf('learn') >= 0) {
      this.selectedContentType = queryParams.selectedTab ? queryParams.selectedTab : 'course';
    } else if (url.indexOf('explore-groups') >= 0) {
      this.selectedContentType = null;
    } else if (url.indexOf('resources') >= 0 || url.indexOf('explore') >= 0) {
      this.selectedContentType = queryParams.selectedTab ? queryParams.selectedTab : 'textbook';
    } else if (url.indexOf('mydownloads') >= 0) {
      this.selectedContentType = queryParams.selectedTab ? queryParams.selectedTab : 'mydownloads';
    } else if (url.indexOf('observation') >= 0) {
      this.selectedContentType = queryParams.selectedTab ? queryParams.selectedTab : 'observation';
    } else {
      this.selectedContentType = queryParams.selectedTab ? queryParams.selectedTab : null;
    }
  }
  updateSelectedContentType(contentType) {
    const ct = this.contentTypes.find((cty: any) => cty.contentType === contentType.toLowerCase());
    if (ct) {
      this.selectedContentType = ct.contentType;
    } else {
      this.selectedContentType = "all";
    }
  }

  updateForm() {
    if (!this.userType) {
      if (this.userService.loggedIn) {
        this.userService.userData$.subscribe((profileData: IUserData) => {
          if(profileData.userProfile["profileUserType"]["type"] !== null){
          this.userType = profileData.userProfile["profileUserType"]["type"];
          }
          this.makeFormChange();
        });
      }
      else {
        let user = localStorage.getItem("userType");
        if (user) {
          this.userType = user;
          this.makeFormChange();
        }
      }
    }
  }
  makeFormChange(){
    let index=this.contentTypes.findIndex(cty=>cty.contentType==="observation");
    if (this.userType != "administrator") {
      this.contentTypes[index].isEnabled = false;
    } else {
      this.contentTypes[index].isEnabled = true;
    }
  }

  processFormData(formData) {
    this.contentTypes = _.sortBy(formData, 'index');
    const defaultTab = _.find(this.contentTypes, ['default', true]);
    this.selectedContentType = this.activatedRoute.snapshot.queryParams.selectedTab || _.get(defaultTab, 'contentType') || 'textbook';
  }

  getTitle(contentType) {
    return _.get(this.resourceService, _.get(contentType, 'title'));
  }

  getIcon(contentType) {
    return _.get(contentType, 'theme.className');
  }

  getContentTypes() {
    const formServiceInputParams = {
      formType: 'contentcategory',
      formAction: 'menubar',
      contentType: 'global'
    };
    this.formService.getFormConfig(formServiceInputParams).subscribe((data: any) => {
      this.processFormData(data);
      this.updateForm();
      this.setContentTypeOnUrlChange();
    });
  }

  isLayoutAvailable() {
    return this.layoutService.isLayoutAvailable(this.layoutConfiguration);
  }

}
