import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-all-programs',
  templateUrl: './list-all-programs.component.html',
  styleUrls: ['./list-all-programs.component.scss']
})
export class ListAllProgramsComponent implements OnInit {

  sbcards = [];
  constructor() { }

  ngOnInit() {
    this.sbcards = [{
      title: 'okay',
      subject: 'test'
    },
    {
      title: 'okay',
      subject: 'test'
    }, {
      title: 'okay',
      subject: 'test'
    }]
  }

}
