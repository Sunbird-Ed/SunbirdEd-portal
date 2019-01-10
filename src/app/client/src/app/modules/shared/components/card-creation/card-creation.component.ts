import { ResourceService } from '../../services/index';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
@Component({
  selector: 'app-card-creation',
  templateUrl: './card-creation.component.html',
  styleUrls: ['./card-creation.component.scss']
})
export class CardCreationComponent {
  /**
  * content is used to render IContents value on the view
  */
  @Input() data: ICard;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();

  constructor(public resourceService: ResourceService) {
  }

  public onAction(data, action) {
    this.clickEvent.emit({ 'action': action, 'data': data });
  }
}
