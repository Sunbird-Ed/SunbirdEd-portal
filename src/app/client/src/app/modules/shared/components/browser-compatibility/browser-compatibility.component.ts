import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ResourceService } from '../../services/index';
@Component({
  selector: 'app-browser-compatibility',
  templateUrl: './browser-compatibility.component.html',
  styleUrls: ['./browser-compatibility.component.scss']
})
export class BrowserCompatibilityComponent implements OnInit {
  @ViewChild('modal') modal;
  @Input() showModal = false;
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
    const browser = (this.deviceInfo.browser).toLowerCase();
    if ((browser !== 'chrome' && browser !== 'firefox') || (this.showModal && browser === 'firefox')) {
      this.modalHandler();
    }
  }

  modalHandler() {
    this.showBrowserMsg = true;
    if ((localStorage.getItem('BrowserIncompatibleModel') !== 'shown')) {
      this.browserCompatible = true;
    }
  }
}
