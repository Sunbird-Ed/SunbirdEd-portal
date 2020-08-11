import {Component, OnDestroy, OnInit} from '@angular/core';
import { Input } from '@angular/core';
import {ILoaderMessage} from '../../interfaces';
import {LayoutService, ResourceService} from '../../services/index';
import * as _ from 'lodash-es';

/**
 * loader component
 */
@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html'
})
export class AppLoaderComponent implements OnInit, OnDestroy {
  @Input() data: ILoaderMessage;
  headerMessage: string;
  loaderMessage: string;
  layoutConfiguration: any;

  constructor(public resourceService: ResourceService, public layoutService: LayoutService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.initLayout();
    this.headerMessage = _.get(this.resourceService.messages.fmsg, 'm0087');
    this.loaderMessage = _.get(this.resourceService.messages.fmsg, 'm0088');
    if (this.data) {
      this.headerMessage = this.data.headerMessage || this.headerMessage;
      this.loaderMessage = this.data.loaderMessage || this.loaderMessage;
    }
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.getLayoutConfig();
  }

}
