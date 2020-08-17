import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LayoutService, ResourceService} from '@sunbird/shared';
import {IInteractEventEdata} from '@sunbird/telemetry';

@Component({
  selector: 'app-joy-theme-popup',
  templateUrl: './joy-theme-popup.component.html',
  styleUrls: ['./joy-theme-popup.component.scss']
})
export class JoyThemePopupComponent implements OnInit {

  isShown = true;
  @Output() closeJoyThemePopup = new EventEmitter<any>();
  instance: string;
  joyThemeIntractEdata: IInteractEventEdata;
  oldThemeIntractEdata: IInteractEventEdata;


  constructor(public layoutService: LayoutService, public resourceService: ResourceService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  ngOnInit() {
    this.setInteractEventData();
  }

  closePopup() {
    localStorage.setItem('joyThemePopup', 'true');
    this.isShown = false;
    this.closeJoyThemePopup.emit();
  }

  setInteractEventData() {
    this.joyThemeIntractEdata = {
      id: 'joy-theme',
      type: 'click',
      pageid: 'joy-themePopup'
    };
    this.oldThemeIntractEdata = {
      id: 'classic-theme',
      type: 'click',
      pageid: 'joy-themePopup'
    };
  }


  switchToNewLayout() {
    const layoutConfig = this.layoutService.getLayoutConfig();
    if (!layoutConfig) {
      this.layoutService.initiateSwitchLayout();
    }
    this.closePopup();
  }

}
