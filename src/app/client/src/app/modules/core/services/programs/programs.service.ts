import { mergeMap, catchError, tap } from 'rxjs/operators';
import { OrgDetailsService } from './../org-details/org-details.service';
import { FrameworkService } from './../framework/framework.service';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { ConfigService } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif } from 'rxjs';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {

  constructor(private extFrameworkService: ExtPluginService, private configService: ConfigService,
    private frameworkService: FrameworkService, private orgDetailsService: OrgDetailsService, private userService: UserService) { }

  enableContributeMenu() {
    return combineLatest([this.userService.userData$, this.orgDetailsService.getCustodianOrgDetails()])
      .pipe(
        mergeMap(([userData, custodianOrgDetails]) => {
          return iif(() => (_.get(userData, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrgDetails, 'result.response.value') && !_.get(userData, 'stateValidated')),
            of(false),
            this.getProgramsList())
        }),
        catchError(err => {
          return of(false);
        })
      )
  }

  private getProgramsList() {
    return of(true);
  }

}
