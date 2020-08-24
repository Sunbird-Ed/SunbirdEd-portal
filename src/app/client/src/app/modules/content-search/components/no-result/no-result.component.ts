import { FormService, UserService } from '@sunbird/core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-no-result-found',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.scss']
})
export class NoResultComponent implements OnInit {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() buttonText: string;
  @Input() showExploreContentButton: boolean;
  @Input() filters;
  @Input() telemetryInteractEdataObject;
  @Output() exploreMoreContent = new EventEmitter();
  instance: string;
  exploreMoreContentEdata: IInteractEventEdata;
  currentPage;
  url;
  constructor( public router: Router, public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute, public formService: FormService,  public userService: UserService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.exploreMoreContentEdata = {
      ...this.telemetryInteractEdataObject,
      extra : {
      ...this.filters
      }
    };
    this.formData();
  }
  formData() {
      const formServiceInputParams = {
        formType: 'contentcategory',
        formAction: 'menubar',
        contentType: 'global'
      };
      this.formService.getFormConfig(formServiceInputParams).subscribe((data: any) => {
        _.forEach(data, (value, key) => {
          if ('all' === value.contentType) {
            this.currentPage = value;
          }
        });
      });
  }
  handleEvent() {
    // this.exploreMoreContent.emit();
    this.url = '/explore';
    if (this.userService.loggedIn) {
      this.url = _.get(this.currentPage, 'loggedInUserRoute.route');
    } else {
      this.url = _.get(this.currentPage, 'anonumousUserRoute.route');
    }
    this.router.navigate([this.url], { queryParams: { selectedTab: 'all' } });
  }

}
