import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-browser-compatibility',
  templateUrl: './browser-compatibility.component.html',
  styleUrls: ['./browser-compatibility.component.css']
})
export class BrowserCompatibilityComponent implements OnInit {
  @ViewChild('modal') modal;
  browserCompatible: boolean;
  isChrome = false;
  showBrowserMsg: boolean;
  deviceInfo: any;
  hideFooter = true;

  constructor(private _deviceDetectorService: DeviceDetectorService) { }

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
