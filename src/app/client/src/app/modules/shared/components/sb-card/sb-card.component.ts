import { ResourceService } from '../../services';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
@Component({
  selector: 'sb-app-card',
  templateUrl: './sb-card.component.html',
  styleUrls: ['./sb-card.component.css']
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
