import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';


@Component({
  selector: 'app-download-datasets',
  templateUrl: './download-datasets.component.html',
  styleUrls: ['./download-datasets.component.scss']
})
export class DownloadDatasetsComponent implements OnInit {

  @Output() closeModalEvent = new EventEmitter();

  @ViewChild('modal') modal;

  @ViewChild('datasets') set initTable(element: ElementRef | null) {
    if (!element) { return; }
    this.prepareTable(element.nativeElement)
  }

  constructor() { }

  ngOnInit() {
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
  });

  private prepareTable(el) {
    const table = $(el).DataTable({
      ...this.getDefaultTableOptions(),
      data: [
        {
          date: "12-03-2020",
          url: "http://localhost:3000"
        },
        {
          date: "13-03-2020",
          url: "http://localhost:3000"
        },
        {
          date: "14-03-2020",
          url: "http://localhost:3000"
        },
        {
          date: "15-03-2020",
          url: "http://localhost:3000"
        },
        {
          date: "16-03-2020",
          url: "http://localhost:3000"
        },
        {
          date: "17-03-2020",
          url: "http://localhost:3000"
        }
      ],
      columns: [
        {
          title: "Time Range",
          data: "date",
          class: "dt-center"
        }, {
          title: "URL",
          data: "url",
          class: "dt-center",
          render: (data, type, row) => {
            const { url } = row;
            const html = `<a href="${url}" class="sb-btn sb-btn-primary sb-left-icon-btn sb-btn-normal"><i class="download icon"></i>Download</a>`;
            return html;
          }
        }
      ]
    });
    $(el).removeClass('no-footer');
  }

  public closeModal(): void {
    if (this.modal) {
      this.modal.deny();
    }
    this.closeModalEvent.emit(true);
  }
}
