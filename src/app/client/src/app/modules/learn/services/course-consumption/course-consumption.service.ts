
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { PlayerService, PermissionService, UserService, GeneraliseLabelService } from '@sunbird/core';
import { ServerResponse, ResourceService, ToasterService } from '@sunbird/shared';
import { CourseProgressService } from '../courseProgress/course-progress.service';
import * as _ from 'lodash-es';
import * as TreeModel from 'tree-model';
import { NavigationExtras, Router } from '@angular/router';
import { NavigationHelperService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class CourseConsumptionService {

  courseHierarchy: any;
  updateContentConsumedStatus = new EventEmitter<any>();
  launchPlayer = new EventEmitter<any>();
  updateContentState = new EventEmitter<any>();
  showJoinCourseModal = new EventEmitter<any>();
  enableCourseEntrollment = new EventEmitter();
  coursePagePreviousUrl: any;
  userCreatedAnyBatch = new EventEmitter();

  constructor(private playerService: PlayerService, private courseProgressService: CourseProgressService,
    private toasterService: ToasterService, private resourceService: ResourceService, private router: Router,
    private navigationHelperService: NavigationHelperService, private permissionService: PermissionService,
    private userService: UserService, public generaliselabelService: GeneraliseLabelService) {
    }

  getCourseHierarchy(courseId, option: any = { params: {} }) {
    if (this.courseHierarchy && this.courseHierarchy.identifier === courseId) {
      return observableOf(this.courseHierarchy);
    } else {
      return this.playerService.getCollectionHierarchy(courseId, option).pipe(map((response: ServerResponse) => {
        this.courseHierarchy = response.result.content;
        return response.result.content;
      }));
    }
  }

  getConfigByContent(contentId, options) {
    return this.playerService.getConfigByContent(contentId, options);
  }
  getContentState(req) {
    return this.courseProgressService.getContentState(req);
  }
  updateContentsState(req) {
    return this.courseProgressService.updateContentsState(req);
  }
  parseChildren(courseHierarchy) {
    const model = new TreeModel();
    const mimeTypeCount = {};
    const treeModel: any = model.parse(courseHierarchy);
    const contentIds = [];
    treeModel.walk((node) => {
      if (node.model.mimeType !== 'application/vnd.ekstep.content-collection') {
        mimeTypeCount[node.model.mimeType] = mimeTypeCount[node.model.mimeType] + 1 || 1;
        contentIds.push(node.model.identifier);
      }
    });

    return contentIds;
  }

  flattenDeep(contents) {
    if (contents) {
      return contents.reduce((acc, val) => {
        if (val.children) {
          acc.push(val);
          return acc.concat(this.flattenDeep(val.children));
        } else {
          return acc.concat(val);
        }
      }, []);
    }
  }

getRollUp(rollup) {
    const objectRollUp = {};
    if (!_.isEmpty(rollup)) {
      for (let i = 0; i < rollup.length; i++ ) {
        objectRollUp[`l${i + 1}`] = rollup[i];
    }
    }
    return objectRollUp;
}

getContentRollUp(tree, identifier) {
  const rollup = [tree.identifier];
  if (tree.identifier === identifier) {
    return rollup;
  }
  if (!tree.children || !tree.children.length) {
    return [];
  }
  let notDone = true;
  let childRollup: any;
  let index = 0;
  while (notDone && tree.children[index]) {
    childRollup = this.getContentRollUp(tree.children[index], identifier);
    if (childRollup && childRollup.length) {
      notDone = false;
    }
    index++;
  }
  if (childRollup && childRollup.length) {
    rollup.push(...childRollup);
    return rollup;
  } else {
    return [];
  }
}
getAllOpenBatches(contents) {
  let openBatchCount = 0;
  _.map(_.get(contents, 'content'), content => {
    if (content.enrollmentType === 'open') {
      openBatchCount++;
    }
  });
  if (openBatchCount === 0) {
    this.enableCourseEntrollment.emit(false);
    this.toasterService.error(this.generaliselabelService.messages.emsg.m0003);
  } else {
    this.enableCourseEntrollment.emit(true);
  }
}

  setPreviousAndNextModule(courseHierarchy: {}, collectionId: string) {
    if (_.get(courseHierarchy, 'children')) {
      let prev;
      let next;
      const children = _.get(courseHierarchy, 'children');
      const i = _.findIndex(children, (o) => o.identifier === collectionId);
      // Set next module
      if (i === 0 || i - 1 !== children.length) { next = children[i + 1]; }
      // Set prev module
      if (i > 0) { prev = children[i - 1]; }
      return { prev, next };
    }
  }

  setCoursePagePreviousUrl() {
    const urlToNavigate = this.navigationHelperService.getPreviousUrl();
   /* istanbul ignore else */
    if (urlToNavigate &&
        (urlToNavigate.url.indexOf('/enroll/batch/') < 0) &&
        (urlToNavigate.url.indexOf('/unenroll/batch/') < 0) &&
        (urlToNavigate.url.indexOf('/course/play/') < 0) ) {
      this.coursePagePreviousUrl = urlToNavigate;
    }
  }

  get getCoursePagePreviousUrl()  {
    return this.coursePagePreviousUrl;
  }

  canCreateBatch(courseHierarchy) {
    return (this.isTrackableCollection(courseHierarchy) && this.permissionService.checkRolesPermissions(['CONTENT_CREATOR'])
      && this.userService.userid === _.get(courseHierarchy, 'createdBy'));
  }

  canViewDashboard(courseHierarchy) {
    return (this.canCreateBatch(courseHierarchy) || this.permissionService.checkRolesPermissions(['COURSE_MENTOR']));
  }

  canAddCertificates(courseHierarchy) {
    return  this.canCreateBatch(courseHierarchy) && this.isTrackableCollection(courseHierarchy) && _.lowerCase(_.get(courseHierarchy, 'credentials.enabled')) === 'yes';
  }

  isTrackableCollection(collection: {trackable?: {enabled?: string}, contentType: string}) {
  return (_.lowerCase(_.get(collection, 'trackable.enabled')) === 'yes' || _.lowerCase(_.get(collection, 'contentType')) === 'course');
  }

  emitBatchList(batches) {
     const mentorBatches = _.map(batches, batch => {
        if ((batch.createdBy === this.userService.userid) ||
        _.includes(batch.mentors, this.userService.userid)
        ) {
          return batch;
          }
      });
      const visibility: boolean = mentorBatches ? mentorBatches.length > 0 : false;
      this.userCreatedAnyBatch.emit(visibility);
  }
}
