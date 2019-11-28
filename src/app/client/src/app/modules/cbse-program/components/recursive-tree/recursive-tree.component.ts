import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recursive-tree',
  templateUrl: './recursive-tree.component.html',
  styleUrls: ['./recursive-tree.component.scss']
})
export class RecursiveTreeComponent implements OnInit {

  @Input() textbookChapters;
  @Input() selectedChapter;
  @Output() emitselectedChapter = new EventEmitter<any>();
  @Output() resourceTemplate = new EventEmitter<any>();
  public showModal = false;
  
  constructor() { }

  ngOnInit() {
  }

  showResourceTemplateEvent(event){
    this.showModal = true;
    this.resourceTemplate.emit({
      showPopup: this.showModal
    });
  }

  crateResource(e){
    e.stopPropagation();
    this.showModal = true;
    this.resourceTemplate.emit({
      showPopup: this.showModal
    });
  }
}
