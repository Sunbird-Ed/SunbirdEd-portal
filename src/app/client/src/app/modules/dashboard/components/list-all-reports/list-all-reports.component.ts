import { UserService } from '@sunbird/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { ResourceService, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { catchError, mergeMap, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ReportService } from '../../services';
import { of, Observable, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import * as $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-list-all-reports',
  templateUrl: './list-all-reports.component.html',
  styleUrls: ['./list-all-reports.component.scss']
})
export class ListAllReportsComponent implements OnInit, AfterViewInit {
  reports: any;

  constructor(public resourceService: ResourceService, private reportService: ReportService, private activatedRoute: ActivatedRoute,
    private router: Router, private userService: UserService, private navigationhelperService: NavigationHelperService) { }

  public reportsList$: Observable<any>;
  public noResultFoundError: string;
  private _isUserReportAdmin: boolean;
  public telemetryImpression: IImpressionEventInput;

  @ViewChild('all_reports') set inputTag(element: ElementRef | null) {
    if (!element) { return; }
    this.prepareTable(element.nativeElement);
  }

  ngOnInit() {
    this.reportsList$ = this.reportService.isAuthenticated(_.get(this.activatedRoute, 'snapshot.data.roles')).pipe(
      mergeMap((isAuthenticated: boolean) => {
        this._isUserReportAdmin = this.reportService.isUserReportAdmin();
        return isAuthenticated ? this.getReportsList(this._isUserReportAdmin) : throwError({ messageText: 'messages.stmsg.m0144' });
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


  private filterReportsBasedOnRoles = (reports: any[]) => {
    if (this.reportService.isUserSuperAdmin()) {
      return this.reportService.getMaterializedChildRows(reports);
    } else if (this.reportService.isUserReportAdmin()) {
      return of(reports);
    } else {
      return of(this.reportService.getFlattenedReports(reports));
    }
  }

  /**
   * @private
   * @returns Observable with list of reports.
   * @memberof ListAllReportsComponent
   */
  private getReportsList(isUserReportAdmin: boolean) {
    const filters = {};
    return this.reportService.listAllReports(filters).pipe(
      mergeMap(res => this.filterReportsBasedOnRoles(res.reports)),
      map(reports => {
        this.reports = reports;
        const count = _.get(reports, 'length');
        return { count, reports };
      })
    );
  }

  /**
   * @description routes to report detailed view page
   * @param {*} event
   * @memberof ListAllReportsComponent
   */
  public rowClickEventHandler(reportId: string, hash?: string, materialize?: boolean) {
    this.router.navigate(['/dashBoard/reports', reportId, ...(hash ? [hash] : [])],
      { queryParams: { ...(this.reportService.isUserSuperAdmin() && { materialize }) } }).catch(err => {
        console.log({ err });
      });
  }

  private renderStatus(data, type, row) {

    if (row.isParameterized && row.children && this.reportService.isUserReportAdmin()) {
      if (_.every(row.children, child => _.toLower(child.status) === 'live')) {
        data = 'live';
      } else {
        if (_.some(row.children, child => _.toLower(child.status) === 'live')) {
          data = 'partially live';
        } else {
          data = 'draft';
        }
      }
    }

    const icon = {
      live: { color: 'success', icon: 'check' },
      draft: { color: 'primary', icon: 'edit' },
      retired: { color: 'warning', icon: 'close' },
      ['partially live']: { color: 'secondary', icon: 'check' }
    };

    const status = _.startCase(_.toLower(data));
    const spanElement = `<span class="sb-label sb-label-table sb-label-${icon[_.toLower(data)].color}">${status}</span>`;
    return spanElement;
  }

  private renderTags(data) {

    if (Array.isArray(data)) {
      const elements = _.join(_.map(data, tag => `<span class="sb-label-name sb-label-table sb-label-primary-100 mr-5">${_.startCase(_.toLower(tag))}</span>`), ' ');
      return `<div class="sb-filter-label mb-16"><div class="d-inline-flex">${elements}</div></div>`;
    }

    return _.startCase(_.toLower(data));
  }

  /**
   * @description initializes the datatables with relevant configurations
   * @param {*} el
   * @memberof ListAllReportsComponent
   */
  public prepareTable(el) {
    const masterTable = $(el).DataTable({
      paging: true,
      lengthChange: true,
      searching: true,
      order: [[1, 'desc']],
      ordering: true,
      info: true,
      autoWidth: true,
      data: this.reports,
      columns: [
        ...(this.reportService.isUserReportAdmin() ? [{
          class: 'details-control',
          orderable: false,
          data: null,
          render: (data, type, row) => {
            const isParameterized = _.get(row, 'isParameterized') || false;
            let count = 0;
            if (isParameterized && row.children) {
              count = _.filter(row.children, child => _.toLower(child.status) === 'live').length;
            }
            return `<button class="sb-btn sb-btn-link sb-btn-link-primary sb-btn-normal sb-btn-square">
            <i class="icon ${isParameterized && row.children ? 'copy outline' : 'file outline'}
            alternate"></i><span>${isParameterized && row.children ? `${count}/${row.children.length} Live` : ''}</span></button>`;
          },
          defaultContent: ''
        }] : []),
        { title: 'Report Id', data: 'reportid', visible: false },
        { title: 'Created On', data: 'createdon', visible: false },
        {
          title: 'Title', data: 'title', render: (data, type, row) => {
            const { title, description } = row;
            return `<div class="sb-media"><div class="sb-media-body"><h6 class="media-heading ellipsis p-0">
                  ${title}</h6> <p class="media-description"> ${description}</p></div></div>`;
          }
        },
        {
          title: 'Last Updated Date', data: 'reportgenerateddate',
          render: (data) => {
            const date = moment(data);
            if (date.isValid()) {
              return `<td> ${moment(data).format('YYYY/MM/DD')} </td>`;
            }
            return _.startCase(_.toLower(data));
          }
        }, {
          title: 'Tags',
          data: 'tags',
          render: this.renderTags
        }, {
          title: 'Update Frequency',
          data: 'updatefrequency',
          render: this.renderTags
        },
        ...(this._isUserReportAdmin ? [{
          title: 'Status',
          data: 'status',
          render: this.renderStatus.bind(this)
        }] : [])]
    });

    $(el).on('click', 'tbody tr td:not(.details-control)', (event) => {
      const rowData = masterTable && masterTable.row(event.currentTarget).data();
      if (_.get(rowData, 'isParameterized') && _.has(rowData, 'children') && rowData.children.length > 0) { return false; }
      const hash = _.get(rowData, 'hashed_val');
      this.rowClickEventHandler(_.get(rowData, 'reportid'), hash);
    });

    const getChildTable = (table_id) => `<table id="${table_id}" class="w-80 b-1"></table>`;

    $(el).on('click', 'td.details-control', (event) => {
      const tr = $(event.currentTarget).closest('tr');
      const row = masterTable.row(tr);
      const rowData = _.get(row, 'data')();
      if (row.child.isShown()) {
        row.child.hide();
      } else {
        if (!rowData.isParameterized) { return false; }
        if (!_.has(rowData, 'children')) { return false; }
        const id = rowData.reportid;
        row.child(getChildTable(id)).show();
        const childTable = $(`#${id}`).DataTable({
          paging: true,
          lengthChange: false,
          searching: true,
          ordering: false,
          info: false,
          autoWidth: false,
          data: rowData.children,
          columns: [{
            title: 'Parameter',
            data: 'hashed_val',
            className: 'text-center',
            render: data => {
              const parameters = _.split(atob(data), '__');
              return parameters;
            }
          }, {
            title: 'Status',
            data: 'status',
            render: this.renderStatus.bind(this),
            className: 'text-center'
          }]
        });

        $(`#${id}`).on('click', 'td', e => {
          const { reportid, hashed_val, materialize } = childTable.row(e.currentTarget).data();
          this.rowClickEventHandler(reportid, hashed_val, materialize || false);
        });
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        object: {
          id: this.userService.userid,
          type: 'user',
          ver: '1.0'
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }

}
