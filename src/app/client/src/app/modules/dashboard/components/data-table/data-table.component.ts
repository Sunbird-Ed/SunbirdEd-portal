import { Component, OnInit, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
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
                'data': this.rowsData,
                'searching': false,
            });
        }, 100);
    }
}
