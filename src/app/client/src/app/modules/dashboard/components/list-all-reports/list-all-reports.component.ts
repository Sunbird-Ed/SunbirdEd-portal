import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { catchError, mergeMap, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ReportService } from '../../services';
import { of, Observable, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-list-all-reports',
  templateUrl: './list-all-reports.component.html',
  styleUrls: ['./list-all-reports.component.scss']
})
export class ListAllReportsComponent implements OnInit {

  constructor(public resourceService: ResourceService, private reportService: ReportService, private activatedRoute: ActivatedRoute,
    private router: Router) { }

  public reportsList$: Observable<any>;
  public noResultFoundError: string;

  ngOnInit() {
    this.reportsList$ = this.reportService.isAuthenticated(_.get(this.activatedRoute, 'snapshot.data.roles')).pipe(
      mergeMap((isAuthenticated: boolean) => {
        return isAuthenticated ? this.getReportsList() : throwError({ messageText: 'messages.stmsg.m0144' });
      }),
      catchError(err => {
        this.noResultFoundError = _.get(err, 'messageText') || 'messages.stmsg.m0006';
        return of({
          table: {},
          count: 0
        });
      })
    );
  }

  /**s
   * @private
   * @returns Observable with list of reports.
   * @memberof ListAllReportsComponent
   */
  private getReportsList() {
    return this.reportService.listAllReports().pipe(
      map((apiResponse: { reports: any[], count: number }) => {
        const reports = _.map(apiResponse.reports, report => {
          return {
            ..._.pick(report, ['reportid', 'title', 'description', 'status', 'reportgenerateddate',
              'tags', 'updatefrequency']), ...(_.get(report, 'reportduration') && {
                startdate: report.reportduration.startdate,
                enddate: report.reportduration.enddate
              }),
          };
        });
        const result = {
          table: {
            header: _.keys(reports[0]),
            data: _.map(reports, report => _.values(report)),
            defs: this.getColumnsDefs(),
            options: {
              searching: true
            }
          },
          count: _.get(apiResponse, 'count')
        };
        return result;
      })
    );
  }

  /**
   * @description returns columns defs to configure datatable.net
   * @private
   * @memberof ListAllReportsComponent
   */
  private getColumnsDefs() {
    return [
      {
        targets: 0,
        visible: false
      },
      {
        targets: [4, 7, 8],
        render: (data) => {
          const date = moment(data);
          if (date.isValid()) {
            return `<td> ${moment(data).format('YYYY/MM/DD')} </td>`;
          }
          return data;
        }
      }
    ];
  }

  /**
   * @description routes to report detailed view page
   * @param {*} event
   * @memberof ListAllReportsComponent
   */
  public rowClickEventHandler(event) {
    this.router.navigate(['/dashBoard/reports', event[0]]).catch(err => {
      console.log({ err });
    });
  }

}
