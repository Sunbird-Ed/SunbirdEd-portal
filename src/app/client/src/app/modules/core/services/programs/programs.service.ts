import { IProgram } from './../../interfaces';
import { mergeMap, catchError, tap, retry, map, shareReplay } from 'rxjs/operators';
import { OrgDetailsService } from './../org-details/org-details.service';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, Observable, BehaviorSubject, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService implements CanActivate {

  public readonly programsList$ = this.getProgramsList();
  public readonly allowToContribute$ = combineLatest([this.userService.userData$, this.orgDetailsService.getCustodianOrgDetails()])
  .pipe(map(([userData, custodianOrgDetails]) =>
    _.get(userData, 'userProfile.rootOrg.rootOrgId') !== _.get(custodianOrgDetails, 'result.response.value') ||
    _.get(userData, 'userProfile.stateValidated')), shareReplay(1));

  constructor(private extFrameworkService: ExtPluginService, private configService: ConfigService,
    private orgDetailsService: OrgDetailsService, private userService: UserService,
    private router: Router, private toasterService: ToasterService, private resourceService: ResourceService) { }

  /**
   * makes api call to get list of programs from ext framework Service
   */
  searchProgramsAPICall(): Observable<ServerResponse> {
    const req = {
      url: _.get(this.configService, 'urlConFig.URLS.CONTRIBUTION_PROGRAMS.SEARCH'),
      param: _.get(this.configService, 'urlConFig.params.programSearch'),
      data: {
        request: {
          rootOrgId: _.get(this.userService, 'userProfile.rootOrg.rootOrgId')
        }
      }
    };
    return this.extFrameworkService.post(req);
  }

  /**
   * gets list of programs
   */
  private getPrograms(): Observable<IProgram[]> {
    return this.searchProgramsAPICall().pipe(
      map(result => _.get(result, 'result.programs')),
      catchError(err => of([]))
    );
  }

  /**
   * filters out programs which are open to enrollment
   */
  private filterPublicPrograms(): Observable<IProgram[]> {
    return this.getPrograms().pipe(map(programs => _.filter(programs, { type: 'public' })));
  }

  /**
   * returns true if more than one programs exists else false
   */
  private getProgramsList(): Observable<IProgram[]>  {
    return this.filterPublicPrograms();
  }

  /**
   * auth guard to prevent unauthorized access to the route
   */
  canActivate(): Observable<boolean> {
    return iif(() => !this.userService.loggedIn, of(false), this.allowToContribute$.pipe(
      tap(allow => {
        if (!allow) {
          this.toasterService.warning(this.resourceService.messages.imsg.m0035);
          this.router.navigate(['learn']);
        }
      })
    )
    );
  }
}
