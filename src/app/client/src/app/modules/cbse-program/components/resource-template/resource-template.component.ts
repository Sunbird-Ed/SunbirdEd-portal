import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-resource-template',
  templateUrl: './resource-template.component.html',
  styleUrls: ['./resource-template.component.scss']
})
export class ResourceTemplateComponent implements OnInit {
  @ViewChild('modal') private modal;
  @Input() configResourceList: any;
  @Output() templateSelection = new EventEmitter<any>();
  showButton = false;
  selectedResource;
  constructor() { }

  ngOnInit() {
    console.log('configResourceList ', this.configResourceList);
  }
  handleSubmit() {
    this.templateSelection.emit({ type: 'submit', template: this.selectedResource });
  }
  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

}
