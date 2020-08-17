import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LayoutService, ResourceService} from '@sunbird/shared';

@Component({
  selector: 'app-joy-theme-popup',
  templateUrl: './joy-theme-popup.component.html',
  styleUrls: ['./joy-theme-popup.component.scss']
})
export class JoyThemePopupComponent implements OnInit {

  isShown = true;
  @Output() closeJoyThemePopup = new EventEmitter<any>();
  instance: string;


  constructor(public layoutService: LayoutService, public resourceService: ResourceService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  ngOnInit() {
  }

  closePopup() {
    localStorage.setItem('joyThemePopup', 'true');
    this.isShown = false;
    this.closeJoyThemePopup.emit();
  }

  switchToOldLayout() {
    const layoutConfig = this.layoutService.getLayoutConfig();
    if (layoutConfig) {
      this.layoutService.initiateSwitchLayout();
    }
    this.closePopup();
  }

}
