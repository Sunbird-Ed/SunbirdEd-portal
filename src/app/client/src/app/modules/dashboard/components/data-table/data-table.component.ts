import { Component, Input, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import * as datatable from 'datatables.net';
import * as naturalSortDataTablePlugin from './../../../../../assets/libs/naturalSortDataTablePlugin';
import * as moment from 'moment';
const GRADE_HEADER = 'Grade';
import * as _ from 'lodash-es';

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
        jQuery['fn']['dataTableExt'] = datatable.ext; // added dataTableExt to jquery
        naturalSortDataTablePlugin(); // adds natural sorting plugin to dataTableExt
        const columnDefs: any = [{
            'targets': 0,
            'render': (data) => {
                const date = moment(data, 'DD-MM-YYYY');
                if (date.isValid()) {
                    return `<td><span style="display:none">
                    ${moment(data, 'DD-MM-YYYY').format('YYYYMMDD')}</span> ${data}</td>`;
                }
                return data;
            }
        }];
        // TODO: Should be configurable, should support multi field and multi type
        const gradeIndex = _.indexOf(this.headerData, GRADE_HEADER);
        if (gradeIndex !== 1) {
            columnDefs.push({
                targets: gradeIndex, // TODO: shouldn't push to all column, only to required field
                type: 'natural'
            });
        }
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
