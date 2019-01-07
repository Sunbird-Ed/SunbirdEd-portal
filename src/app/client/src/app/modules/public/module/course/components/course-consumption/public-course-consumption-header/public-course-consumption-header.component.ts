
import { combineLatest as observableCombineLatest, Subject } from 'rxjs';
import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import {
  ResourceService, ToasterService, ContentUtilsServiceService, ITelemetryShare
} from '@sunbird/shared';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-public-course-consumption-header',
  templateUrl: './public-course-consumption-header.component.html',
  styleUrls: ['./public-course-consumption-header.component.css']
})
export class PublicCourseConsumptionHeaderComponent implements OnInit, OnDestroy {

  sharelinkModal: boolean;

  /**
	 * telemetryShareData
	*/
  telemetryShareData: Array<ITelemetryShare>;
  shareLink: string;
  /**
   * to show loader while copying content
   */
  showCopyLoader = false;
  @Input() courseHierarchy: any;
  courseId: string;
  public unsubscribe = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute,
    public resourceService: ResourceService, private router: Router, public toasterService: ToasterService,
    public contentUtilsServiceService: ContentUtilsServiceService) {
  }

  ngOnInit() {
  }

  onShareLink() {
    this.shareLink = this.contentUtilsServiceService.getCoursePublicShareUrl(this.courseHierarchy.identifier);
    this.setTelemetryShareData(this.courseHierarchy);
  }
  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
