import { ResourceService } from '../../services/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import {IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-card-creation',
  templateUrl: './card-creation.component.html',
  styleUrls: ['./card-creation.component.scss']
})
export class CardCreationComponent implements OnInit {
  /**
  * content is used to render IContents value on the view
  */
  @Input() data: ICard;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();
  telemetryInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;

  constructor(public resourceService: ResourceService) {
  }

  ngOnInit() {
    this.telemetryInteractObject = {
      id: this.data.metaData.identifier,
      type: this.data.metaData.contentType,
      ver: '1.0'
    };
    this.telemetryInteractEdata = {
      id: 'delete',
      type: 'click',
      pageid: _.get(this.data, 'telemetryObjectType')
    };
  }

  public onAction(data, action) {
    this.clickEvent.emit({ 'action': action, 'data': data });
  }
}
