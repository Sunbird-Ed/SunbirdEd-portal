import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { catchError, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ReportService } from '../../services';
import { of, Observable, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-all-reports',
  templateUrl: './list-all-reports.component.html',
  styleUrls: ['./list-all-reports.component.scss']
})
export class ListAllReportsComponent implements OnInit {

  constructor(public resourceService: ResourceService, private reportService: ReportService, private activatedRoute: ActivatedRoute) { }

  public reportsList$: Observable<any>;
  public noResultFoundError: string;

  ngOnInit() {
    this.reportsList$ = this.reportService.isAuthenticated(_.get(this.activatedRoute, 'snapshot.data.roles')).pipe(
      mergeMap((isAuthenticated: boolean) => {
        return isAuthenticated ? this.getReportsList() : throwError({ messageText: 'messages.stmsg.m0144' });
      }),
      catchError(err => {
        this.noResultFoundError = _.get(err, 'messageText') || "messages.stmsg.m0006";
        return of({
          reports: [],
          count: 0
        })
      })
    );
  }

  /**s
   * @private
   * @returns Observable with list of reports. 
   * @memberof ListAllReportsComponent
   */
  private getReportsList() {
    return this.reportService.listAllReports();
  }

  public getContentForCard(report) {
    return { name: _.get(report, 'title') || 'Untitle Report ', resourceType: 'Report' };
  }

}
