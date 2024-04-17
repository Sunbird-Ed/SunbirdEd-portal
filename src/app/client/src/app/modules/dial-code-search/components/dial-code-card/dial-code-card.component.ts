import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { ResourceService, ICard } from '@sunbird/shared';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

@Component({
  selector: 'app-dial-code-card',
  templateUrl: './dial-code-card.component.html',
  styleUrls: ['./dial-code-card.component.scss']
})
export class DialCodeCardComponent implements OnInit {

/**
 * content is used to render IContents value on the view
 */
  @Input() data: ICard;
  @Input() dialCode: string;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();
  @Input() singleContentRedirect: string;
  telemetryCdata: Array<{}> = [];
  frameworkCategoriesList;

  constructor(public resourceService: ResourceService, public cslFrameworkService:CslFrameworkService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.frameworkCategoriesList = this.cslFrameworkService?.getAllFwCatName();
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'DialCode', 'id': this.dialCode }];
    }
    if (this.singleContentRedirect === this.data.name) {
      this.onAction(this.data, this.data.action.onImage);
    }
  }

  public onAction(data, action) {
    this.clickEvent.emit({ 'action': action, 'data': data });
  }
}
