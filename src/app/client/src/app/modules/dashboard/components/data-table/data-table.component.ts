import { Component, OnInit, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
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

    ngAfterViewInit() {
        setTimeout(() => {
            $(`#${this.tableId}`).removeAttr('width').DataTable({
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
                    }],
                'data': this.rowsData,
                'searching': false,
            });
        }, 100);
    }
}
