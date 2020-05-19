import { Injectable } from '@angular/core';
import { FrameworkService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { map, mergeMap, filter, first } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private channelService: ChannelService, private orgDetailsService: OrgDetailsService, private userService: UserService,
    private frameworkService: FrameworkService ) { }

  public isCustodianOrgUser() {
    return this.orgDetailsService.getCustodianOrg().pipe(map((custodianOrg) => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        return true;
      }
      return false;
    }));
  }

  public getCustodianOrgData() {
    return this.channelService.getFrameWork(this.userService.hashTagId).pipe(map((channelData: any) => {
      const custOrgFrameworks = _.sortBy(_.get(channelData, 'result.channel.frameworks') || [], 'index');
      return {
          range: custOrgFrameworks,
          label: 'Board',
          code: 'board',
          index: 1
        };
    }));
  }

  public getFilteredFieldData(frameWorkId?) {
    this.frameworkService.initialize(frameWorkId);
    return this.frameworkService.frameworkData$.pipe(
      filter((frameworkDetails: any) => {
      if (!frameworkDetails.err) {
        const framework = frameWorkId ? frameWorkId : 'defaultFramework';
        if (!_.get(frameworkDetails.frameworkdata, framework)) {
          return false;
        }
      }
      return true;
    }),
    mergeMap((frameworkDetails: any) => {
      if (!frameworkDetails.err) {
        return this.filterFrameworkCategories(frameworkDetails, frameWorkId);
      } else {
        return throwError(frameworkDetails.err);
      }
    }), map((formData: any) => {
        return this.filterFrameworkCategoryTerms(formData);
    }), first());
  }

  public filterFrameworkCategories(frameworkDetails, frameWorkId) {
    const framework = frameWorkId ? frameWorkId : 'defaultFramework';
    const frameworkData = _.get(frameworkDetails.frameworkdata, framework);
    frameWorkId = frameworkData.identifier;
    const categoryMasterList = _.filter(frameworkData.categories, (category) => {
      return ['board', 'medium', 'gradeLevel', 'subject'].includes(_.get(category, 'code'));
    });
    return of({categoryMasterList, 'frameWorkId': frameWorkId});
  }

  public filterFrameworkCategoryTerms(formData) {
    const formFieldProperties = _.filter(formData.categoryMasterList, (formFieldCategory) => {
      formFieldCategory.range = _.get(_.find(formData.categoryMasterList, { code : formFieldCategory.code }), 'terms') || [];
      return true;
    });
    return {'formFieldProperties': _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index'), 'frameWorkId': formData.frameWorkId};
  }


}
