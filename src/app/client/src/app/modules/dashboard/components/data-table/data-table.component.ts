import { Component, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import * as moment from 'moment';
@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit {
    @Input() tableId: any;
    @Input() rowsData: Array<string[]>;
    @Input() headerData: string[];
    @Input() columnDefinations: any[] = [];
    @Output() rowClickEvent = new EventEmitter<any>();
    @Input() options = {};

    ngAfterViewInit() {
        setTimeout(() => {
            const table = $(`#${this.tableId}`).removeAttr('width').DataTable({
                retrieve: true,
                'columnDefs': [
                    {
                        'targets': 0,
                        'render': (data) => {
                            const date = moment(data, 'DD-MM-YYYY');
                            if (date.isValid()) {
                                return `<td><span style="display:none">
                                ${moment(data, 'DD-MM-YYYY').format('YYYYMMDD')}</span> ${data}</td>`;
                            }
                            return data;
                        },
                    }, ...this.columnDefinations],
                'data': this.rowsData,
                searching: false,
                ...this.options
            });

            $(`#${this.tableId} tbody`).on('click', 'tr', (event) => {
                const data = table.row(event.currentTarget).data();
                this.rowClickEvent.emit(data);
            });
        }, 100);
    }
}
