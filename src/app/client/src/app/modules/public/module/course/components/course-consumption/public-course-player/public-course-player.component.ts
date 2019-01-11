import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import {
  ILoaderMessage, ConfigService, ICollectionTreeOptions,
  ToasterService, ResourceService
} from '@sunbird/shared';
import { CourseConsumptionService } from '@sunbird/learn';
import { IImpressionEventInput } from '@sunbird/telemetry';
@Component({
  selector: 'app-public-course-player',
  templateUrl: './public-course-player.component.html',
  styleUrls: ['./public-course-player.component.css']
})
export class PublicCoursePlayerComponent implements OnInit, OnDestroy {

  private courseId: string;

  public collectionTreeNodes: any;

  public loader = true;

  public showError = false;

  public courseHierarchy: any;

  public readMore = false;

  public curriculum = [];

  public telemetryCourseImpression: IImpressionEventInput;

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
    private toasterService: ToasterService, private resourceService: ResourceService) {
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
  }

  ngOnInit() {
    const routeParams: any = { ...this.activatedRoute.snapshot.params };
    this.courseId = routeParams.courseId;
    const inputParams = {params: this.configService.appConfig.CourseConsumption.contentApiQueryParams};
    this.courseConsumptionService.getCourseHierarchy(routeParams.courseId, inputParams).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(courseHierarchy => {
        this.loader = false;
        this.courseHierarchy = courseHierarchy;
        this.parseChildContent();
        this.setTelemetryCourseImpression();
        this.collectionTreeNodes = { data: this.courseHierarchy };
      });
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
