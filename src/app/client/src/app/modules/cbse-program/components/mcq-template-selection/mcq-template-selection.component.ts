import { ConfigService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { mcqTemplateConfig } from './mcq-template-data';

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
  mcqTemplateConfig = mcqTemplateConfig.templateConfig;
  constructor(public configService: ConfigService) { }

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
