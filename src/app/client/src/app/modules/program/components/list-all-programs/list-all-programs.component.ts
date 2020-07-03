import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { Observable, of } from 'rxjs';
import { ResourceService, ConfigService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { ProgramsService, PublicDataService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { map, catchError, retry, tap, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-list-all-programs',
  templateUrl: './list-all-programs.component.html',
  styleUrls: ['./list-all-programs.component.scss']
})
export class ListAllProgramsComponent implements OnInit, AfterViewInit {

  public programsList$;
  public noResultFound;
  public telemetryImpression: IImpressionEventInput;

  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private config: ConfigService, private publicDataService: PublicDataService,
    private activatedRoute: ActivatedRoute, private router: Router, private navigationHelperService: NavigationHelperService) { }

  ngOnInit() {
    this.programsList$ = this.getProgramsList();
  }

  /**
   * fetch the list of programs.
   * @description
   * 1. Fetch programs list
   * 2. Identify program(s) which does not have `rootOrgName`
   * 3. Fetch `rootOrgName` based on their `rootOrgId`
   * 4. Map `rootOrgName` for programs
   */
  private getProgramsList() {
    const rootOrgIds = new Array();
    return this.programsService.programsList$.pipe(
      mergeMap(programs  => {
        _.forEach(programs, (program) => {
          if (!_.get(program, 'rootOrgName') && rootOrgIds.indexOf(program.rootOrgId) === -1) {
            rootOrgIds.push(program.rootOrgId);
          }
        });
        return this.getRootOrgName(rootOrgIds).pipe(map(data => {
          _.forEach(programs, (program) => {
            if (!_.get(program, 'rootOrgName')) {
              program['rootOrgName'] = data[program.rootOrgId];
            }
          });
          return programs;
        }));
      })
    );
  }

  /**
   * returns the orgName for the provided rootOrgId.
   * @param  {Array} rootOrgId : Array of Root Org Id(s)
   * @returns Observable       : Object consisting of orgId and orgName as key value pair respectively
   */
  private getRootOrgName(rootOrgId): Observable<{}> {
    const orgMapping = new Object();
    return this.getOrgDetails(rootOrgId).pipe(
      map(orgDetailsApiResponse => {
        const orgDetails = _.get(orgDetailsApiResponse, 'result.response.content');
        if (orgDetails.length > 0) {
          _.forEach(orgDetails, (org) => {
            orgMapping[org.id] = org.orgName;
          });
        }
        return orgMapping;
      }),
      retry(1),
      catchError(err => {
        return of('');
      })
    );
  }

  /**
   * makes api call to get orgDetails.
   * @param  {Array} rootOrgId : Array of Root Org Id(s)
   * @returns Observable       : Server response
   */
  private getOrgDetails(rootOrgId): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.ORG_EXT_SEARCH,
      data: {
        request: {
          filters: {
            id: rootOrgId,
          }
        }
      }
    };
    return this.publicDataService.post(option);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
          uri: this.router.url,
          subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  public getTelemetryInteractEdata(id: string): IInteractEventEdata {
    return {
      id,
      type: 'click',
      pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid')
    };
  }

  public getTelemetryInteractObject(id: string): IInteractEventObject {
    return {
      id,
      type: 'Program',
      ver: '1.0'
    };
  }

  getFeatureId(featureId, taskId) {
    return [{ id: featureId, type: 'Feature' }, { id: taskId, type: 'Task' }];
  }
}
