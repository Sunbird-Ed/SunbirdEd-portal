import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';
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
  private _isUserReportAdmin: boolean;

  ngOnInit() {
    this.reportsList$ = this.reportService.isAuthenticated(_.get(this.activatedRoute, 'snapshot.data.roles')).pipe(
      mergeMap((isAuthenticated: boolean) => {
        return isAuthenticated ? this.reportService.isUserReportAdmin().pipe(
          tap(isReportAdmin => this._isUserReportAdmin = isReportAdmin),
          mergeMap(isReportAdmin => this.getReportsList(isReportAdmin))
        ) : throwError({ messageText: 'messages.stmsg.m0144' });
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
  private getReportsList(isUserReportAdmin: boolean) {
    const filters = {
      status: ['live', ...isUserReportAdmin ? ['draft', 'retired'] : []]
    };
    return this.reportService.listAllReports(filters).pipe(
      map((apiResponse: { reports: any[], count: number }) => {
        const reports = _.map(apiResponse.reports, report => {
          return {
            ..._.pick(report, ['reportid', 'title', 'description', 'reportgenerateddate',
              'tags', 'updatefrequency'], ...isUserReportAdmin ? ['status'] : [])
          };
        });
        const headers = ['reportid', 'Title', 'Description', 'Last Updated Date', 'Tags', 'Update Frequency',
          ...isUserReportAdmin ? ['Status'] : []];
        const result = {
          table: {
            header: headers || _.keys(reports[0]),
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
        targets: [1, 2],
        width: '25%'
      },
      {
        targets: [4],
        width: '15%',
        render: data => {
          if (Array.isArray(data)) {
            return _.map(data, tag => `<div class="sb-label sb-label-table sb-label-primary-100">${_.startCase(_.toLower(tag))}</div>`);
          }
          return _.startCase(_.toLower(data));
        }
      },
      {
        targets: [3, 5, 1, 2],
        render: (data) => {
          const date = moment(data);
          if (date.isValid()) {
            return `<td> ${moment(data).format('YYYY/MM/DD')} </td>`;
          }
          return _.startCase(_.toLower(data));
        }
      },
      ...(this._isUserReportAdmin ? [{
        targets: [6],
        render: (data) => {
          const icon = {
            live: {
              color: 'secondary',
              icon: 'check'
            },
            draft: {
              color: 'primary',
              icon: 'edit'
            },
            retired: {
              color: 'gray',
              icon: 'close'
            }
          };
          return `<button class="sb-btn sb-btn-${icon[_.toLower(data)].color} sb-btn-normal sb-btn-square">
          <i class="icon ${icon[_.toLower(data)].icon} alternate"></i><span>${_.startCase(_.toLower(data))}</span></button>`;
        }
      }] : [])
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
