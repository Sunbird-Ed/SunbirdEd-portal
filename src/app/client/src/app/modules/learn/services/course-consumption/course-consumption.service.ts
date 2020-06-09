
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { PlayerService } from '@sunbird/core';
import { ServerResponse } from '@sunbird/shared';
import { CourseProgressService } from '../courseProgress/course-progress.service';
import * as _ from 'lodash-es';
import * as TreeModel from 'tree-model';

@Injectable({
  providedIn: 'root'
})
export class CourseConsumptionService {

  courseHierarchy: any;
  updateContentConsumedStatus = new EventEmitter<any>();
  launchPlayer = new EventEmitter<any>();

  constructor(private playerService: PlayerService, private courseProgressService: CourseProgressService) { }

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
}
