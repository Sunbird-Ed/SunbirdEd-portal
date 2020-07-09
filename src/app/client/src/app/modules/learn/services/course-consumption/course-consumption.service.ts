
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { PlayerService } from '@sunbird/core';
import { ServerResponse, ResourceService, ToasterService } from '@sunbird/shared';
import { CourseProgressService } from '../courseProgress/course-progress.service';
import * as _ from 'lodash-es';
import * as TreeModel from 'tree-model';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CourseConsumptionService {

  courseHierarchy: any;
  updateContentConsumedStatus = new EventEmitter<any>();
  launchPlayer = new EventEmitter<any>();
  updateContentState = new EventEmitter<any>();
  showJoinCourseModal = new EventEmitter<any>();

  constructor(private playerService: PlayerService, private courseProgressService: CourseProgressService,
    private toasterService: ToasterService, private resourceService: ResourceService, private router: Router) { }

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
    this.toasterService.error(this.resourceService.messages.emsg.m0003);
  }
}
// navigateToPlayerPage(collectionUnit: {}, event?) {
  navigateToPlayerPage(parentCourse: {}, batchId: string, contentStatus: [], collectionUnit: {}) {
    const navigationExtras: NavigationExtras = {
      queryParams: { batchId, courseId: _.get(parentCourse, 'identifier'), courseName: _.get(parentCourse, 'name') }
    };

    if (_.get(collectionUnit, 'mimeType') === 'application/vnd.ekstep.content-collection' && _.get(collectionUnit, 'children.length')
      && _.get(contentStatus, 'length')) {
      const parsedChildren = this.parseChildren(collectionUnit);
      const collectionChildren = [];
      contentStatus.forEach(item => {
        if (parsedChildren.find(content => content === _.get(item, 'contentId'))) {
          collectionChildren.push(item);
        }
      });

      /* istanbul ignore else */
      if (collectionChildren.length) {
        const selectedContent: any = collectionChildren.find(item => item.status !== 2);

        /* istanbul ignore else */
        if (selectedContent) {
          navigationExtras.queryParams.selectedContent = selectedContent.contentId;
        }
      }
    }
    this.router.navigate(['/learn/course/play', _.get(collectionUnit, 'identifier')], navigationExtras);
  }

  setPreviousAndNextModule(courseHierarchy: {}, collectionId: string,) {
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
}
