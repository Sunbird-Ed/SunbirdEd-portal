import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import {ILoaderMessage} from '../../interfaces';
import { ResourceService } from '../../services/index';

/**
 * loader component
 */
@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html'
})
export class AppLoaderComponent implements OnInit {
  /**
   * loader message
  */
  @Input() data: ILoaderMessage;
  /**
   * header message
  */
  headerMessage = this.resourceService.messages.fmsg.m0087;
  /**
   * loader message
  */
  loaderMessage = this.resourceService.messages.fmsg.m0088;

  constructor(public resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    if (this.data) {
      this.headerMessage = this.data.headerMessage || this.headerMessage;
      this.loaderMessage = this.data.loaderMessage || this.loaderMessage;
    }
  }
}
