import { Component, OnInit, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import * as moment from 'moment';
const GRADE_HEADER = 'Grades';
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
        const columnDefs: any = [{
            'targets': 0,
            'render': (data) => {
                const date = moment(data, 'DD-MM-YYYY');
                if (date.isValid()) {
                    return `<td><span style="display:none">
                    ${moment(data, 'DD-MM-YYYY').format('YYYYMMDD')}</span> ${data}</td>`;
                }
                return data;
            },
        }];
        // TODO: Should be configurable, should support multi field and multi type
        const gradeIndex = this.headerData.indexOf(GRADE_HEADER);
        if (gradeIndex !== 1) {
            columnDefs.push({
                'targets': '_all',
                'type': 'grade-sort'
              });
        }
        $.fn.dataTable.ext.type.order['grade-sort-pre'] = (data) => {
            if (typeof data === 'string' && data.startsWith('Class')) {
                 const number = parseInt(data.split('Class')[1], 10);
                 return number;
            }
            return data;
        };
        setTimeout(() => {
             $(`#${this.tableId}`).removeAttr('width').DataTable({
                retrieve: true,
                columnDefs,
                data: this.rowsData,
                searching: false,
            });
        }, 100);
    }
}
