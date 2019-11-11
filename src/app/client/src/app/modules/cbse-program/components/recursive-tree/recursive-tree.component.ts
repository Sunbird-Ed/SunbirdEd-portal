import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recursive-tree',
  templateUrl: './recursive-tree.component.html',
  styleUrls: ['./recursive-tree.component.scss']
})
export class RecursiveTreeComponent implements OnInit {

  @Input() textbookChapters;
  @Output() selectedChapter = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log(this.textbookChapters);
  }

  public createHandler(e, unitIdentifier) {
    e.stopPropagation();
    this.selectedChapter.emit({
      showModal: true,
      unitIdentifier: unitIdentifier
    });
  }
}
