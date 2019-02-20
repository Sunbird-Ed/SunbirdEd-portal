import { Component, OnInit, Input, AfterViewInit, AfterViewChecked } from '@angular/core';

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit, AfterViewChecked {

    @Input() rowsData: Array<string[]>;
    @Input() headerData: string[];
    table: any;
    ngAfterViewInit() {
        this.table = $('#table').DataTable({
            'data': this.rowsData,
            'scrollX': true,
            'searching': false,
            });
        }

    ngAfterViewChecked() {
    setTimeout(() => {
        this.table.columns.adjust().draw();
    }, 100);
}
}
