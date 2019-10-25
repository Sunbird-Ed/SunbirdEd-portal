import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recursive-tree',
  templateUrl: './recursive-tree.component.html',
  styleUrls: ['./recursive-tree.component.scss']
})
export class RecursiveTreeComponent implements OnInit {

  @Input() textbookChapters;

  constructor() { }

  ngOnInit() {
    console.log(this.textbookChapters);



  }

}
