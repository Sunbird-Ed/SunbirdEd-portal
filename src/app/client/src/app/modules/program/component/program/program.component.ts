
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash-es';

import { Subject } from 'rxjs';

/**
 * This component displays announcement inbox card on the home page.
 */
@Component({
  selector: 'app-program-component',
  templateUrl: './program.component.html'
})
export class ProgramComponent implements OnInit, OnDestroy {

  public unsubscribe = new Subject<void>();

  @Output() inviewEvent = new EventEmitter<any>();


  /**
   * To call resource service which helps to use language constant.
   */
  public resourceService: ResourceService;

  /**
   * Constructor
   * inject service(s)
   * @param {ResourceService} resourceService Reference of ResourceService.
   * @param {AnnouncementService} announcement Reference of AnnouncementService.
   * @param {ConfigService} config Reference of config service.
   */
  constructor(resourceService: ResourceService,
    config: ConfigService) {
    this.resourceService = resourceService;
  }


  /**
   * This method calls the populateHomeInboxData to show inbox list.
	 */
  ngOnInit() {

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
