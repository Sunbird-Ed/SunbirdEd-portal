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
  @Input() data: ILoaderMessage;
  headerMessage: string;
  loaderMessage: string;

  constructor(public resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.headerMessage = this.resourceService.messages.fmsg.m0087;
    this.loaderMessage = this.resourceService.messages.fmsg.m0088;
    if (this.data) {
      this.headerMessage = this.data.headerMessage || this.headerMessage;
      this.loaderMessage = this.data.loaderMessage || this.loaderMessage;
    }
  }
}
