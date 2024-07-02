import { ResourceService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { IDataset } from '../../interfaces';
import { DatasetService, ReportService } from '../../services';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, of, zip, Subscription, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import dayjs from 'dayjs';
import { get, chunk, map as _map, first, last, partition, forEach, flatMap } from 'lodash-es';
import $ from 'jquery';
import 'datatables.net';
@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit, OnDestroy {

  @Input() dataset: IDataset;
  @Input() markdownUpdated$: Subject<{ data: string, type: string }>;
  public timeRangePicker: UntypedFormGroup;
  public dataDictionary: string;
  public examples: string;
  public showLoader = false;

  public get pickerMaxDate() {
    return dayjs().subtract(1, 'day').toDate();
  }

  public get pickerMinDate() {
    if (get(this.dataset, 'dataAvailableFrom')) {
      return dayjs(this.dataset.dataAvailableFrom).toDate();
    }
    return dayjs().subtract(6, 'month').toDate();
  }

  subscription: Subscription;
  table: any;
  data: any;
  options: any = { maxLines: 1000, printMargin: false };

  private customTimePicker = new BehaviorSubject({ from: dayjs().subtract(7, 'day').toDate(), to: dayjs().subtract(1, 'day').toDate() });

  @ViewChild('datasets') set initTable(element: ElementRef | null) {
    if (!element) { return; }
    this.prepareTable(element.nativeElement);
  }

  constructor(private datasetService: DatasetService, private formBuilder: UntypedFormBuilder,
    public reportService: ReportService, private activatedRoute: ActivatedRoute,
    public resourceService: ResourceService) { }

  onMarkdownChange(updatedData: string, type: 'dataDictionary' | 'examples') {
    this[type] = updatedData;
  }

  private prepareForm() {
    this.timeRangePicker = this.formBuilder.group({
      from: [dayjs().subtract(7, 'day').toDate()],
      to: [dayjs().subtract(1, 'day').toDate()]
    });
    this.subscribeToTimePicker();
  }

  ngOnInit() {
    this.prepareForm();
    this.setMarkdowns();
  }

  private setMarkdowns() {
    const { dataDictionary = '', examples = '' } = this.dataset || {};
    try {
      this.dataDictionary = atob(dataDictionary);
      this.examples = atob(examples);
    } catch (error) {
      console.error(error);
      this.dataDictionary = this.examples = '';
    }
  }

  subscribeToTimePicker() {
    this.subscription = this.customTimePicker.pipe(
      tap(res => this.showLoader = true),
      distinctUntilChanged((p: any, n: any) => JSON.stringify(p) === JSON.stringify(n)),
      filter(res => res.from && res.to && res.from <= res.to),
      switchMap((res: any) => {
        const dateRange = this.getDateRange(res.from, res.to, false);
        const chunks = this.getDateChunks(dateRange);
        return zip(..._map(chunks, chunkObj => {
          const [from, to] = chunkObj;
          return this.getDataset({ from: dayjs(from), to: dayjs(to) });
        }));
      })
    ).subscribe(data => {
      this.showLoader = false;
      this.reRenderTable(data);
    }, err => {
      this.showLoader = false;
    });
  }

  private reRenderTable(data) {
    this.data = flatMap(data);
    if (this.table) {
      this.table.clear();
      this.table.rows.add(this.data);
      this.table.draw();
    }
  }

  onSubmit() {
    this.customTimePicker.next(this.timeRangePicker.value);
  }

  private getDataset({ from = dayjs().subtract(7, 'day'), to = dayjs().subtract(1, 'day') }) {
    const dateRange = this.getDateRange(from, to);
    const { hash } = this.activatedRoute.snapshot.params;
    return this.datasetService.getDataSet({
      datasetId: this.dataset.datasetId || 'raw',
      from: from.format('YYYY-MM-DD'), to: to.format('YYYY-MM-DD'),
      ...(hash && {
        header: {
          ['X-Channel-Id']: atob(hash)
        }
      })
    })
      .pipe(
        map((response: { files: string[], periodWiseFiles: { [key: string]: string[] } }) => {
          const { periodWiseFiles } = response;
          return _map(dateRange, date => {
            const files = get(periodWiseFiles, date);
            const [json = [], csv = []] = partition(files, val => val.includes('.json'));
            return { date, json, csv };
          });
        }),
        catchError(err => {
          return of([]);
        })
      );
  }

  private getDateRange(startDate, endDate, formatted = true) {
    const dates = [];
    while (startDate <= endDate) {
      const date = dayjs(startDate);
      if (formatted) {
        dates.push(date.format('YYYY-MM-DD'));
      } else {
        dates.push(date.toDate());
      }
      startDate = date.add(1, 'day');
    }
    return dates;
  }

  private getDateChunks(dates: string[], chunkSize: number = 7) {
    const chunks = chunk(dates, chunkSize);
    return _map(chunks, chunkObj => [first(chunkObj), last(chunkObj)]);
  }

  getPickerMinDate() {
    const startDate = get(this.timeRangePicker.get('from'), 'value');
    if (!startDate) { return this.pickerMinDate; }
    return startDate;
  }

  getPickerMaxDate() {
    const endDate = get(this.timeRangePicker.get('to'), 'value');
    if (!endDate) { return this.pickerMaxDate; }
    return endDate;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
* @description returns default config options for master and child table
* @private
* @memberof ListAllReportsComponent
*/
  private getDefaultTableOptions = () => ({
    paging: true,
    lengthChange: false,
    searching: false,
    ordering: true,
    info: false,
    autoWidth: true
  })

  private handleDownload(event) {
    const fileType = event.target.getAttribute('filetype');
    const tr = $(event.currentTarget).closest('tr');
    const row = this.table.row(tr);
    const data = row.data();
    forEach(data[fileType], file => {
      window.open(file, '_blank');
    });
  }

  private prepareTable(el) {
    this.table = $(el).DataTable({
      ...this.getDefaultTableOptions(),
      data: this.data || [],
      columns: [
        {
          title: 'Date',
          data: 'date',
          class: 'dt-center'
        }, {
          title: 'Download Files',
          class: 'dt-center download-datasets',
          render: (data, type, row) => {
            const downloadFormat = this.dataset.downloadFormats || ['json', 'csv'];
            const html = `<div>
            ${downloadFormat.map(format => {
              return `<button filetype="${format}" class="sb-btn sb-btn-primary sb-left-icon-btn sb-btn-normal ${row[format] && !row[format].length ? 'sb-btn-disabled' : ''}">
              <i class="download icon"></i>${format.toUpperCase()}</button>`;
            })}
             </div>`;
            return html;
          }
        }
      ]
    });

    $(el).on('click', '.download-datasets', this.handleDownload.bind(this));

    $(el).removeClass('no-footer');
  }

  handleMarkdownSubmission(event) {
    this.markdownUpdated$.next({ data: this[event], type: event });
  }
}
