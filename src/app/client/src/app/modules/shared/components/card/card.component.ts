import { ResourceService } from '../../services/index';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent {
  /**
  * content is used to render IContents value on the view
  */
  @Input() data: ICard;
  @Input() dialCode: string;
  @Input() customClass: string;
  @Input() hideProgress: boolean;
  @Output() clickEvent = new EventEmitter<any>();
  telemetryCdata: Array<{}> = [];
  hover: Boolean;
  isConnected: Boolean = navigator.onLine;
  route: string;
  
  get categories(): string[] {
    const fwCategoryObject = localStorage.getItem('fwCategoryObject');
    if (fwCategoryObject) {
      try {
        const categories = JSON.parse(fwCategoryObject);
        return Object.keys(categories).map(key => categories[key].code);
      } catch (e) {
        console.error('Error parsing framework categories:', e);
        return [];
      }
    }
    return [];
  }

  constructor(public resourceService: ResourceService, private router: Router) {
    this.resourceService = resourceService;
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'DialCode', 'id': this.dialCode }];
    }
    this.route = this.router.url;
  }

  public onAction(data, action) {
    this.clickEvent.emit({ 'action': action, 'data': data });
  }
}
