import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {LayoutService, ResourceService} from '@sunbird/shared';
import {IInteractEventEdata} from '@sunbird/telemetry';

@Component({
  selector: 'app-joy-theme-popup',
  templateUrl: './joy-theme-popup.component.html',
  styleUrls: ['./joy-theme-popup.component.scss']
})
export class JoyThemePopupComponent implements OnInit {
  @ViewChild('modal') modal;
  @Output() closeJoyThemePopup = new EventEmitter<any>();
  instance: string;
  joyThemeIntractEdata: IInteractEventEdata;
  closeButtonIntractEdata: IInteractEventEdata;
  oldThemeIntractEdata: IInteractEventEdata;
  showPopup = false;


  constructor(public layoutService: LayoutService, public resourceService: ResourceService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  ngOnInit() {
    const joyThemePopup = localStorage.getItem('joyThemePopup');
    if (!joyThemePopup) {
      this.showPopup = true;
    }
    this.setInteractEventData();
  }

  closePopup() {
    localStorage.setItem('joyThemePopup', 'true');
    this.modal.deny();
    this.showPopup = false;
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
    this.closeButtonIntractEdata = {
      id: 'close-joy-theme-popup',
      type: 'click',
      pageid: 'joy-themePopup'
    };
  }


  switchToNewLayout(isNewTheme) {
    const layoutConfig = this.layoutService.getLayoutConfig();
    if (!layoutConfig) {
      this.layoutService.initiateSwitchLayout();
    }
    if (!isNewTheme) {
      this.layoutService.initiateSwitchLayout();
    }
    this.closePopup();
  }

}
