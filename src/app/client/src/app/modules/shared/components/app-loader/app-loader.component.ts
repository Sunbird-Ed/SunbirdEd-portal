import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import {ILoaderMessage} from '../../interfaces';
import {LayoutService, ResourceService} from '../../services/index';
import * as _ from 'lodash-es';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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
  layoutConfiguration: any;
  private unsubscribe$ = new Subject<void>();

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
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }
}
