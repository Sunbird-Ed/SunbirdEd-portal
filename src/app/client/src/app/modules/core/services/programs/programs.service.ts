import { IProgramsList } from './../../interfaces';
import { mergeMap, catchError, tap, retry, map, skipWhile, delay } from 'rxjs/operators';
import { OrgDetailsService } from './../org-details/org-details.service';
import { FrameworkService } from './../framework/framework.service';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { ConfigService } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, Observable, BehaviorSubject, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { data } from './data';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {

  private enableContributeTab: boolean;
  private _programsList$ = new BehaviorSubject<IProgramsList>(undefined);

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
          return iif(() => _.get(userData, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrgDetails, 'result.response.value') || !_.get(userData, 'userProfile.stateValidated'),
            of(false),
            this.getProgramsList().pipe(
              map((programs: IProgramsList) => !_.isEmpty(programs))
            ))
        }),
        retry(1),
        catchError(err => {
          console.error(err);
          return of(false);
        }),
        tap((showTab: boolean) => {
          this.enableContributeTab = showTab;
        })
      )
  }

  /**
   * get list of programs from ext framework Service
   */
  private getProgramsList() {
    return of(data).pipe(
      map((apiResponse) => _.get(apiResponse, 'result.programs')),
      catchError(err => {
        return of([]);
      }),
      tap((programs: IProgramsList) => {
        this._programsList$.next(programs);
      })
    );
  }

  get showContributeTab() {
    return this.enableContributeTab;
  }

}
