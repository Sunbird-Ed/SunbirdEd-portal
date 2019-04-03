import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ResourceService } from '../../services/index';
@Component({
  selector: 'app-browser-compatibility',
  templateUrl: './browser-compatibility.component.html',
  styleUrls: ['./browser-compatibility.component.scss']
})
export class BrowserCompatibilityComponent implements OnInit {
  @ViewChild('modal') modal;
  browserCompatible: boolean;
  isChrome = false;
  showBrowserMsg: boolean;
  deviceInfo: any;
  hideFooter = true;

  constructor(public resourceService: ResourceService, private _deviceDetectorService: DeviceDetectorService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.showCompatibilityModal();
  }

  openCompatibilityModel() {
    this.browserCompatible = true;
  }

  hideCompatibilityModel() {
    this.browserCompatible = false;
    localStorage.setItem('BrowserIncompatibleModel', 'shown');
  }

  showCompatibilityModal() {
    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
    if ( this.deviceInfo.browser !== 'chrome') {
      this.showBrowserMsg = true;
      if ((localStorage.getItem('BrowserIncompatibleModel') !== 'shown')) {
        this.browserCompatible = true;
      }
    }

  }

}
