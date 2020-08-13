import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormService, UserService} from './../../services';
import * as _ from 'lodash-es';
import {LayoutService, ResourceService} from '@sunbird/shared';
import {Router, ActivatedRoute} from '@angular/router';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-content-type',
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss']
})
export class ContentTypeComponent implements OnInit, OnDestroy {
  @Input() layoutConfiguration;
  contentTypes;
  selectedContentType;
  public unsubscribe$ = new Subject<void>();

  constructor(public formService: FormService, public resourceService: ResourceService,
              public router: Router, public userService: UserService,
              public activatedRoute: ActivatedRoute, public layoutService: LayoutService) {
  }

  ngOnInit() {
    this.getContentTypes();
  }

  getTitle(contentType) {
    return _.get(this.resourceService, _.get(contentType, 'title'));
  }

  setContentTypeOnUrlChange() {
    combineLatest(this.activatedRoute.queryParams, this.activatedRoute.params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.setSelectedContentType(this.router.url, result[0], result[1]);
      });
  }

  setSelectedContentType(url, queryParams, pathParams) {
    if (url.indexOf('play') >= 0) {
      this.selectedContentType = queryParams.contentType ? queryParams.contentType.toLowerCase() : null;
    } else if (url.indexOf('explore-course') >= 0 || url.indexOf('learn') >= 0) {
      this.selectedContentType = 'course';
    } else if (url.indexOf('explore-groups') >= 0) {
      this.selectedContentType = null;
    } else if (url.indexOf('resources') >= 0 || url.indexOf('explore') >= 0) {
      this.selectedContentType = queryParams.selectedTab ? queryParams.selectedTab : 'textbook';
    } else {
      this.selectedContentType = null;
    }
  }

  isLayoutAvailable() {
    return this.layoutService.isLayoutAvailable(this.layoutConfiguration);
  }

  showContentType(data) {
    if (this.userService.loggedIn) {
      this.router.navigate([data.loggedInUserRoute.route],
        {queryParams: {...this.activatedRoute.snapshot.queryParams, selectedTab: data.loggedInUserRoute.queryParam}});
    } else {
      this.router.navigate([data.anonumousUserRoute.route],
        {queryParams: {...this.activatedRoute.snapshot.queryParams, selectedTab: data.anonumousUserRoute.queryParam}});
    }
  }

  processFormData(formData) {
    this.contentTypes = _.sortBy(formData, 'index');
    this.selectedContentType = this.activatedRoute.snapshot.queryParams.selectedTab || 'textbook';
  }

  getIcon(contentType) {
    return _.get(contentType, 'theme.className');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  getContentTypes() {
    const formServiceInputParams = {
      formType: 'contentcategory',
      formAction: 'menubar',
      contentType: 'global'
    };
    this.formService.getFormConfig(formServiceInputParams).subscribe((data: any) => {
      this.processFormData(data);
      this.setContentTypeOnUrlChange();
    });
  }
}
