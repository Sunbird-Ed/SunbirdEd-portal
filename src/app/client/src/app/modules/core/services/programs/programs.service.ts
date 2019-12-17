import { mergeMap, catchError, tap, retry, map, skipWhile, delay } from 'rxjs/operators';
import { OrgDetailsService } from './../org-details/org-details.service';
import { FrameworkService } from './../framework/framework.service';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { ConfigService } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, Observable, BehaviorSubject, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { mockResponseData } from './programs.service.spec.data';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {

  private _programsList$ = new BehaviorSubject(undefined);

  public readonly programsList$ = this._programsList$.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));

  constructor(private extFrameworkService: ExtPluginService, private configService: ConfigService,
    private frameworkService: FrameworkService, private orgDetailsService: OrgDetailsService, private userService: UserService) { }

  /**
   * logic which decides whether or not to show contribute tab menu
   */
  enableContributeMenu(): Observable<boolean> {
    return combineLatest([this.userService.userData$, this.orgDetailsService.getCustodianOrgDetails()])
      .pipe(
        mergeMap(([userData, custodianOrgDetails]) => {
          return iif(() => _.get(userData, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrgDetails, 'result.response.value') ||
            !_.get(userData, 'userProfile.stateValidated'),
            of(false),
            this.getProgramsList().pipe(
              map((programs) => !_.isEmpty(programs))
            ));
        }),
        retry(1),
        catchError(err => {
          console.error(err);
          return of(false);
        })
      );
  }

  /**
   * get list of programs from ext framework Service
   */
  private getProgramsList() {
    // const req = {
    //   url: _.get(this.configService, 'urlConFig.URLS.CONTRIBUTION_PROGRAMS.SEARCH'),
    //   data: {
    //     request: {
    //       channelId: 'channel'
    //     }
    //   }
    // };

    return of(mockResponseData.mockProgramsApiResponse).pipe(
      map((apiResponse) => _.get(apiResponse, 'result.programs')),
      catchError(err => {
        return of([]);
      }),
      tap((programs) => {
        this._programsList$.next(programs);
      })
    );
  }
}
