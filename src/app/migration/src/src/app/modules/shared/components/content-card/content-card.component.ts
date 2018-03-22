import { ResourceService } from '../../services/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {IContents} from '../../interfaces/content';

/**
* This display a content card
*/
@Component({
selector: 'app-content-card',
templateUrl: './content-card.component.html',
styleUrls: ['./content-card.component.css']
})
export class ContentCardComponent {
/**
* content is used to render IContents value on the view
*/
@Input() content: IContents;
@Output('actionClick')
actionClick = new EventEmitter<any>();

public onAction(contentId, actionType) {
  console.log(contentId);
  this.actionClick.emit({'type': actionType, 'contentId': contentId});
}
}
