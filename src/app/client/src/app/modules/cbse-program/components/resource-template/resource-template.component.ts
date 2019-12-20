import { Component, OnInit, ViewChild, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ISessionContext, IChapterListComponentInput, IResourceTemplateComponentInput } from '../../interfaces';

@Component({
  selector: 'app-resource-template',
  templateUrl: './resource-template.component.html',
  styleUrls: ['./resource-template.component.scss']
})
export class ResourceTemplateComponent implements OnInit, OnDestroy {

  @ViewChild('modal') private modal;
  @Input() resourceTemplateComponentInput: IResourceTemplateComponentInput = {};
  @Output() templateSelection = new EventEmitter<any>();
  showButton = false;
  public templateList;
  public templateSelected;
  constructor() { }


  ngOnInit() {
    this.templateList = _.get(this.resourceTemplateComponentInput, 'templateList');
  }

  handleSubmit() {
    const templateDetails = _.find(this.templateList, (template) => {
      return template.id === this.templateSelected;
    });
    this.templateSelection.emit({ type: 'next', template: this.templateSelected, templateDetails: templateDetails });
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

}
