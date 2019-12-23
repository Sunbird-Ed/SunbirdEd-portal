import { Observable, of } from 'rxjs';
import { ResourceService, ConfigService, ServerResponse } from '@sunbird/shared';
import { ProgramsService, PublicDataService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { map, catchError, retry } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-all-programs',
  templateUrl: './list-all-programs.component.html',
  styleUrls: ['./list-all-programs.component.scss']
})
export class ListAllProgramsComponent implements OnInit {

  public programsList$;
  public noResultFound;
  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private config: ConfigService, private publicDataService: PublicDataService, private router: Router) { }

  ngOnInit() {
    this.programsList$ = this.getProgramsList();
  }

  /**
   * fetch the list of programs.
   */
  private getProgramsList() {
    return this.programsService.programsList$.pipe(
      map(programs => {
        _.forEach(programs, async (program) => {
          if (!_.get(program, 'rootOrgName')) {
            program['rootOrgName'] = await this.getRootOrgName(_.get(program, 'rootOrgId')).toPromise();
          }
        });
        return programs;
      })
    );
  }

  /**
   * returns the orgName for the provided rootOrgId.
   * @param rootOrgId
   */
  private getRootOrgName(rootOrgId): Observable<string> {
    return this.getOrgDetails(rootOrgId).pipe(
      map(orgDetailsApiResponse => {
        const orgDetails = _.get(orgDetailsApiResponse, 'result.response.content');
        return _.join(_.map(orgDetails, 'orgName'), ',');
      }),
      retry(1),
      catchError(err => {
        return of('');
      })
    );
  }

  /**
   * makes api call to get orgDetails.
   * @param rootOrgId
   */
  private getOrgDetails(rootOrgId): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: {
            id: [rootOrgId],
          }
        }
      }
    };
    return this.publicDataService.post(option);
  }
}
