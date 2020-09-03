import { UserService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { ResourceService, NavigationHelperService, LayoutService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export class ListAllReportsComponent implements OnInit {
  reports: any;

  constructor(public resourceService: ResourceService, public reportService: ReportService, private activatedRoute: ActivatedRoute,
    private router: Router, private userService: UserService, private navigationhelperService: NavigationHelperService,
    private telemetryService: TelemetryService, private layoutService: LayoutService) { }

  public reportsList$: Observable<any>;
  public noResultFoundError: string;
  private _isUserReportAdmin: boolean;
  layoutConfiguration: any;


  @ViewChild('all_reports') set inputTag(element: ElementRef | null) {
    if (!element) { return; }
    const [reports, ] = this.reports;
    this.prepareTable(element.nativeElement, reports);
  }

  @ViewChild('all_datasets') set datasetTable(element: ElementRef | null) {
    if (!element) { return; }
    let [, datasets] = this.reports;
    if (this.reportService.isUserReportAdmin() && !this.reportService.isUserSuperAdmin()) {
      datasets = datasets.filter(dataset => dataset.status === 'live');
    }
    this.prepareTable(element.nativeElement, datasets);
  }

  ngOnInit() {
    this.initLayout();
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
        const [reportsArr, datasetsArr] = this.reports = _.partition(reports, report => _.toLower(_.get(report, 'report_type')) === 'report');
        const count = _.get(reports, 'length');
        return { count, reportsArr, datasetsArr };
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
      { queryParams: { ...(this.reportService.isUserReportAdmin() && { materialize }) } }).catch(err => {
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
      live: { color: 'success-0', icon: 'check' },
      draft: { color: 'warning-0', icon: 'edit' },
      retired: { color: 'primary-100', icon: 'close' },
      ['partially live']: { color: 'secondary-0', icon: 'check' }
    };

    const status = _.startCase(_.toLower(data));
    const spanElement = `<span class="sb-label sb-label-table sb-label-${icon[_.toLower(data)].color}">
    ${data === 'live' ? `<span class="sb-live"></span>` : ''} ${status}</span>`;
    return spanElement;
  }

  private renderTags(data) {

    if (Array.isArray(data)) {
      const elements = _.join(_.map(data, tag => `<span class="sb-label-name sb-label-table sb-label-primary-100 mr-5 px-8 py-4">${_.startCase(_.toLower(tag))}</span>`), ' ');
      return `<div class="sb-filter-label"><div class="d-inline-flex m-0">${elements}</div></div>`;
    }

    return _.startCase(_.toLower(data));
  }

  /**
   * @description returns default config options for master and child table
   * @private
   * @memberof ListAllReportsComponent
   */
  private getDefaultTableOptions = () => ({
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: true,
  })


  private indexColumn(table) {
    table.on('order.dt search.dt', () => {
      table.column(0, { search: 'applied', order: 'applied' }).nodes().each((cell, i) => {
        cell.innerHTML = i + 1;
      });
    }).draw();
  }

  /**
   * @description initializes the dataTables with relevant configurations
   * @param {*} el
   * @memberof ListAllReportsComponent
   */
  public prepareTable(el, data = []) {
    const masterTable = $(el).DataTable({
      ...this.getDefaultTableOptions(),
      order: [[1, 'desc']],
      data,
      columns: [
        {
          title: 'Serial No.',
          searchable: false,
          orderable: false,
          data: null
        },
        { title: 'Created On', data: 'createdon', visible: false },
        ...(this.reportService.isUserReportAdmin() ? [{
          class: 'details-control',
          orderable: false,
          data: null,
          render: (value, type, row) => {
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
        {
          title: 'Title', data: 'title', render: (value, type, row) => {
            const { title, description } = row;
            return `<div class="sb-media"><div class="sb-media-body"><h6 class="p-0">
                  ${title}</h6> <p class="media-description sb__ellipsis"> ${description}</p></div></div>`;
          }
        },
        {
          title: 'Last Updated Date', data: 'reportgenerateddate',
          render: (value) => {
            const date = moment(value);
            if (date.isValid()) {
              return `<td> ${moment(value).format('YYYY/MM/DD')} </td>`;
            }
            return _.startCase(_.toLower(value));
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

    this.indexColumn(masterTable);

    $(el).on('click', 'tbody tr td:not(.details-control)', (event) => {
      const rowData = masterTable && masterTable.row(event.currentTarget).data();
      if (_.get(rowData, 'isParameterized') && _.has(rowData, 'children') && rowData.children.length > 0) { return false; }
      const { reportid, hashed_val, materialize } = rowData;
      this.logTelemetry({ type: 'select-report', id: `${reportid}` });
      this.rowClickEventHandler(reportid, hashed_val, materialize || false);
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

        this.logTelemetry({
          type: 'select-parameterized', id: `${id}`,
          cdata: [{ id: `${_.get(rowData, 'children.length')}`, type: 'CountReports' },
          { id: `${this.getReportsCount({ reports: rowData.children, status: 'live' })}`, type: 'Live' },
          { id: `${this.getReportsCount({ reports: rowData.children, status: 'draft' })}`, type: 'Draft' }]
        });

        row.child(getChildTable(id)).show();
        const childTable = $(`#${id}`).DataTable({
          ...this.getDefaultTableOptions(),
          lengthChange: false,
          info: false,
          data: rowData.children,
          columns: [
            {
              title: 'Serial No.',
              searchable: false,
              orderable: false,
              data: null
            },
            {
              title: 'Parameter',
              data: 'hashed_val',
              className: 'text-center',
              render: value => {
                const parameters = _.split(atob(value), '__');
                return parameters;
              }
            }, {
              title: 'Status',
              data: 'status',
              render: this.renderStatus.bind(this),
              className: 'text-center'
            }]
        });

        this.indexColumn(childTable);

        $(`#${id}`).on('click', 'td', e => {
          const { reportid, hashed_val, materialize } = childTable.row(e.currentTarget).data();
          this.logTelemetry({ type: 'select-report', id: `${reportid}`, cdata: [{ id: `${this.reportService.getParameterFromHash(hashed_val)}`, type: 'ParameterName' }] });
          this.rowClickEventHandler(reportid, hashed_val, materialize || false);
        });
      }
    });
  }

  public getTelemetryImpression = ({ type, cdata = [] }) => ({
    context: {
      env: this.activatedRoute.snapshot.data.telemetry.env,
      cdata
    },
    object: {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    },
    edata: {
      type,
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
      uri: this.router.url,
      duration: this.navigationhelperService.getPageLoadTime()
    }
  })

  public setTelemetryInteractObject = ({ id, type = 'Report', ver = '1.0' }) => ({ id, type, ver });

  public setTelemetryInteractEdata({ type, id = 'reports-list' }) {
    return {
      id,
      type,
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }

  private logTelemetry({ type, cdata = [], id }) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'reports',
        cdata
      },
      edata: {
        ...this.setTelemetryInteractEdata({ type }),
      },
      object: {
        ...this.setTelemetryInteractObject({ id }),
        rollup: {}
      }
    };
    this.telemetryService.interact(interactData);
  }

  private getReportsCount({ reports = [], status = 'draft' }) {
    return _.size(_.filter(reports, report => _.get(report, 'status') === status));
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout()
      .subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
  }

}
