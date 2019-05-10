import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mcq-template-selection',
  templateUrl: './mcq-template-selection.component.html',
  styleUrls: ['./mcq-template-selection.component.scss']
})
export class McqTemplateSelectionComponent implements OnInit, OnDestroy {

  showButton = false;
  templateSelected;
  @ViewChild('modal') private modal;
  @Output() templateSelection = new EventEmitter<any>();
  mcqTemplateConfig = [{
      id: 1, url: 'assets/images/mcq_template/grid.png'
    }, {
      id: 2, url: 'assets/images/mcq_template/grid2.png'
    }, {
      id: 3, url: 'assets/images/mcq_template/vertical.png'
    }, {
      id: 4, url: 'assets/images/mcq_template/vertical2.png'
    }, {
      id: 5, url: 'assets/images/mcq_template/horizontal.png'
  }];
  constructor() { }

  ngOnInit() {
  }
  handleSubmit() {
    this.templateSelection.emit({ type: 'submit', template: this.templateSelected });
  }
  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
