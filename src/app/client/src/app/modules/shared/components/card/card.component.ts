import { ResourceService } from '../../services/index';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  /**
* content is used to render IContents value on the view
*/
  @Input() data: ICard;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();

  constructor(public resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  public onAction(data, action) {
    this.clickEvent.emit({ 'action': action, 'data': data });
  }
}
