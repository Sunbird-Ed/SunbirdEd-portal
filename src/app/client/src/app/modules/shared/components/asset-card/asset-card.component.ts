import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import { ResourceService } from '../../services/index';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent  {

  @Input() data: ICard;
  @Input() dialCode: string;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();
  telemetryCdata: Array<{}> = [];

  constructor(public resourceService: ResourceService) {
    this.resourceService = resourceService;
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'dialCode', 'id': this.dialCode }];
    }
  }

  public onAction(data, action) {
    this.clickEvent.emit({ 'action': action, 'data': data });
  }

}
