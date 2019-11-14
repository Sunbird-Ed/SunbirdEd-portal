import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-library-filters',
  templateUrl: './library-filters.component.html',
  styleUrls: ['./library-filters.component.scss']
})
export class LibraryFiltersComponent implements OnInit {
  multiSelect1: { name: string; }[];
  selectMedium: { name: string; id: string; value: string; };

  constructor() { }

  ngOnInit() {
    // this.multiSelect1 = [{name: 'Karnataka'}, {name: 'Andhra Pradesh'}, {name: 'Tamil Nadu'},
    // {name: 'Maharashtra'}, {name: 'Kerala'}, {name: 'Telangana'}];
  }

}
