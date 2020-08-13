import {Component, Input, OnInit} from '@angular/core';
import {FormService, UserService} from './../../services';
import * as _ from 'lodash-es';
import {LayoutService, ResourceService} from '@sunbird/shared';
import {Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-content-type',
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss']
})
export class ContentTypeComponent implements OnInit {
  @Input() layoutConfiguration;
  contentTypes;
  selectedContentType;

  constructor(public formService: FormService, public resourceService: ResourceService,
              public router: Router, public userService: UserService,
              public activatedRoute: ActivatedRoute, public layoutService: LayoutService) {
  }

  ngOnInit() {
    this.getContentTypes();
  }

  getContentTypes() {
    const formServiceInputParams = {
      formType: 'contentcategory',
      formAction: 'menubar',
      contentType: 'global'
    };
    this.formService.getFormConfig(formServiceInputParams).subscribe((data: any) => {
      this.processFormData(data);
    });
  }

  isLayoutAvailable() {
    return this.layoutService.isLayoutAvailable(this.layoutConfiguration);
  }

  processFormData(formData) {
    this.contentTypes = _.sortBy(formData, 'index');
    this.selectedContentType = this.activatedRoute.snapshot.queryParams.selectedTab || 'textbook';
  }

  getIcon(contentType) {
    return _.get(contentType, 'theme.className');
  }

  getTitle(contentType) {
    return _.get(this.resourceService, _.get(contentType, 'title'));
  }

  showContentType(data) {
    this.selectedContentType = data.contentType;
    if (this.userService.loggedIn) {
      this.router.navigate([data.loggedInUserRoute.route],
        {queryParams: {...this.activatedRoute.snapshot.queryParams, selectedTab: data.loggedInUserRoute.queryParam}});
    } else {
      this.router.navigate([data.anonumousUserRoute.route],
        {queryParams: {...this.activatedRoute.snapshot.queryParams, selectedTab: data.anonumousUserRoute.queryParam}});
    }
  }

}
