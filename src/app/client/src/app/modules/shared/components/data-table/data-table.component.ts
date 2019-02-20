import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit {

    @Input() rowsData: Array<string[]>;
    @Input() headerData: string[];

    ngAfterViewInit() {
        setTimeout(() => {
            $('#table').removeAttr('width').DataTable({
                'data': this.rowsData,
                // 'scrollX': true,
                'searching': false,
            });
            // $('#CourseStatsTable').DataTable({
            //     language: {
            //         search: '_INPUT_',
            //         searchPlaceholder: 'Search User Name',
            //     }
            // });
        }, 100);
    }
}
