import {Component, OnInit} from '@angular/core';
import {Input} from '@angular/core';
import {ILoaderMessage} from '../../interfaces';
import {ConfigService, LayoutService, ResourceService} from '../../services/index';
import * as _ from 'lodash-es';

/**
 * loader component
 */
@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss']
})
export class AppLoaderComponent implements OnInit {
  @Input() data: ILoaderMessage;
  headerMessage: string;
  loaderMessage: string;
  layoutConfiguration: any;

  constructor(public resourceService: ResourceService, public layoutService: LayoutService,
              private configService: ConfigService) {
    this.resourceService = resourceService;
  }

  initLayout() {
    const layoutType = localStorage.getItem('layoutType') || this.configService.constants.DEFAULT_THEME;
    if (layoutType === this.configService.constants.DEFAULT_THEME) {
      this.layoutConfiguration = this.configService.appConfig.layoutConfiguration;
    }
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

}
