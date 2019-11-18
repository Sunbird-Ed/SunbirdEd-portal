import { Component, OnInit } from '@angular/core';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';

@Component({
    selector: 'app-library-filters',
    templateUrl: './library-filters.component.html',
    styleUrls: ['./library-filters.component.scss']
})
export class LibraryFiltersComponent implements OnInit {
    multiSelect1: { name: string; }[];
    selectMedium: { name: string; id: string; value: string; };
    public mediums = [
        'english',
        'mathematics',
        'geology',
        'biology',
        'zoology',
        'Botany',
        'Environmental Science'
    ];

    classes = [
        'Class 1',
        'Class 2',
        'Class 3',
        'Class 4',
        'Class 5',
        'Class 6',
        'Class 7'
    ];

    mediumLayout = LibraryFiltersLayout.SQUARE;
    classLayout = LibraryFiltersLayout.ROUND;

    constructor() { }

    ngOnInit() {
        this.multiSelect1 = [
            { name: 'Karnataka' },
            { name: 'Andhra Pradesh' },
            { name: 'Tamil Nadu' },
            { name: 'Maharashtra' },
            { name: 'Kerala' },
            { name: 'Telangana' }
        ];
    }

}
