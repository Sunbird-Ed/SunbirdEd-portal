import { combineLatest, Subject } from 'rxjs';
import { takeUntil, first, mergeMap, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BreadcrumbsService, CoursesService } from '@sunbird/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import {
  ILoaderMessage, ConfigService, ICollectionTreeOptions,
  ToasterService, ResourceService
} from '@sunbird/shared';
import { CourseConsumptionService, CourseBatchService, CourseProgressService } from '@sunbird/learn';
import { IImpressionEventInput, IEndEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-public-course-player',
  templateUrl: './public-course-player.component.html',
  styleUrls: ['./public-course-player.component.css']
})
export class PublicCoursePlayerComponent implements OnInit, OnDestroy {

  public courseInteractObject: IInteractEventObject;

  private courseId: string;

  public courseStatus: string;

  public collectionTreeNodes: any;

  public loader = true;

  public showError = false;

  @Input() courseHierarchy: any;

  public readMore = false;

  public curriculum = [];

  public telemetryCourseImpression: IImpressionEventInput;

  public contentStatus: any;

  public treeModel: any;

  public loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };

  public collectionTreeOptions: ICollectionTreeOptions;

  public unsubscribe = new Subject<void>();

  constructor(public activatedRoute: ActivatedRoute, private configService: ConfigService,
    private courseConsumptionService: CourseConsumptionService,
    public router: Router,
    private toasterService: ToasterService, private resourceService: ResourceService, public breadcrumbsService: BreadcrumbsService,
    public courseBatchService: CourseBatchService,
    public coursesService: CoursesService) {
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
  }

  ngOnInit() {
    // this.courseId = params.courseId;
    // set telemetry impression object
    // process course herirarchy
  }

  private parseChildContent() {
    const model = new TreeModel();
    const mimeTypeCount = {};
    this.treeModel = model.parse(this.courseHierarchy);
    this.treeModel.walk((node) => {
      if (node.model.mimeType !== 'application/vnd.ekstep.content-collection') {
        if (mimeTypeCount[node.model.mimeType]) {
          mimeTypeCount[node.model.mimeType] += 1;
        } else {
          mimeTypeCount[node.model.mimeType] = 1;
        }
        // this.contentDetails.push({ id: node.model.identifier, title: node.model.name });
      }
    });
    _.forEach(mimeTypeCount, (value, key) => {
      this.curriculum.push({ mimeType: key, count: value });
    });
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private setTelemetryCourseImpression() {
    this.telemetryCourseImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
      },
      object: {
        id: this.courseId,
        type: 'course',
        ver: '1.0'
      }
    };
  }
}
