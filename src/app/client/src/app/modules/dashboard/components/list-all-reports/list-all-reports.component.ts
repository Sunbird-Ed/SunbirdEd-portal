import { ResourceService } from '@sunbird/shared';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ReportService } from '../../services';
import { of } from 'rxjs';


@Component({
  selector: 'app-list-all-reports',
  templateUrl: './list-all-reports.component.html',
  styleUrls: ['./list-all-reports.component.scss']
})
export class ListAllReportsComponent implements OnInit {

  constructor(private http: HttpClient, public resourceService: ResourceService, private reportService: ReportService) { }

  public reportsList$;

  ngOnInit() {
    this.reportsList$ = this.getReportsList();
  }

  private getReportsList() {
    return this.reportService.listAllReports().pipe(
      catchError(err => {
        return of({
          reports: [],
          count: 0
        })
      })
    );
  }

  public getContentForCard(report) {
    return { name: _.get(report, 'title') || 'Untitle Report ', resourceType: 'Report' };
  }

}
