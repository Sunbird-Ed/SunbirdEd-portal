import { Component, OnInit, EventEmitter , Output } from '@angular/core';
import { ResourceService } from '../../services/index';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-install-app',
  templateUrl: './install-app.component.html',
  styleUrls: ['./install-app.component.scss']
})
export class InstallAppComponent implements OnInit {
  showPopUp = true;
  @Output() viewInBrowser = new EventEmitter<any>();
  instance: string;
  /**
  * To call resource service which helps to use language constant
  */
 public resourceService: ResourceService;
  constructor( resourceService: ResourceService ) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);

  }
  closePopUp() {
    this.showPopUp = false;
  }
  navigateToLibrary() {
    this.closePopUp();
    this.viewInBrowser.emit();
  }
}
