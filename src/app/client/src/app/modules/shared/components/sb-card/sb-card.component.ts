import { ResourceService } from '../../services/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
@Component({
  selector: 'app-sb-card',
  templateUrl: './sb-card.component.html',
  styleUrls: ['./sb-card.component.scss']
})
export class SbCardComponent {
  /**
* content is used to render IContents value on the view
*/
  @Input() data: ICard;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();

  public onAction(data, action) {
    this.clickEvent.emit({ 'action': action, 'data': data });
  }
}
