
import {takeUntil} from 'rxjs/operators';
import { HomeAnnouncementService } from './../../service/index';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AnnouncementService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';

import { IAnnouncementListData } from '@sunbird/announcement';
import { IImpressionEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

import { Subject } from 'rxjs';

/**
 * This component displays announcement inbox card on the home page.
 */
@Component({
  selector: 'app-home-announcement',
  templateUrl: './home-announcement.component.html',
  styleUrls: ['./home-announcement.component.css']
})
export class HomeAnnouncementComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<void>();
  @Output('inviewEvent')
  inviewEvent = new EventEmitter<any>();


  /**
   * To call resource service which helps to use language constant.
   */
  public resourceService: ResourceService;
  /**
   * To make inbox API calls.
   */
  private homeAnnouncementService: HomeAnnouncementService;
  /**
   * To make inbox API calls.
   */
  private announcementService: AnnouncementService;
  /**
   * To get url, app configs.
   */
  public config: ConfigService;
  /**
   * Contains result object returned from get Inbox API.
   */
  announcementlist: IAnnouncementListData;
  /**
  * Contains page limit of home inbox list.
  */
  pageLimit: number;
  /**
   * Contains current page number of outbox list.
   */
  pageNumber: number;
  /**
   * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;
  seeAllInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  /**
   * Constructor
   * inject service(s)
   * @param {ResourceService} resourceService Reference of ResourceService.
   * @param {AnnouncementService} announcement Reference of AnnouncementService.
   * @param {ConfigService} config Reference of config service.
   */
  constructor(resourceService: ResourceService, homeAnnouncementService: HomeAnnouncementService,
    config: ConfigService, announcementService: AnnouncementService) {
    this.resourceService = resourceService;
    this.homeAnnouncementService = homeAnnouncementService;
    this.announcementService = announcementService;
    this.config = config;
  }
  /**
   * This method calls the announcement inbox API.
   */
  public populateHomeInboxData(limit: number, pageNumber: number) {
    this.pageNumber = pageNumber;
    this.pageLimit = limit;
    const option = {
      pageNumber: this.pageNumber,
      limit: this.pageLimit
    };
    this.homeAnnouncementService.getInboxData(option).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (apiResponse) => {
        this.showLoader = false;
        if (apiResponse) {
          this.announcementlist = apiResponse;
          // Calling received API
          _.each(this.announcementlist.announcements, (key) => {
            if (key.received === false) {
              this.announcementService.receivedAnnouncement({ announcementId: key.id }).subscribe(
                (response: ServerResponse) => { }
              );
            }
          });
        }
      },
      err => {
        this.showLoader = false;
      });
  }

  /**
   * This method checks whether a announcement's status is true or false.
   * If false it calls the read API with the particular announcement id
   * and changes its read status to true
	 *
	 * @param {string} announcementId Clicked announcement id
	 * @param {boolean} read Read status of the clicked announcement id
	 */
  readAnnouncement(announcementId: string, read: boolean): void {
    if (read === false) {
      this.announcementService.readAnnouncement({ announcementId: announcementId }).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response: ServerResponse) => {
          _.each(this.announcementlist.announcements, (key, index) => {
            if (announcementId === key.id) {
              this.announcementlist.announcements[index].read = true;
            }
          });
        }
      );
    }
  }

  /**
   * This method calls the populateHomeInboxData to show inbox list.
	 */
  ngOnInit() {
    this.populateHomeInboxData(this.config.appConfig.ANNOUNCEMENT.HOME.PAGE_LIMIT, this.pageNumber);
    this.setInteractEventData();
  }

  public inview(event) {
    this.inviewEvent.emit(event);
  }
  setInteractEventData() {
    this.seeAllInteractEdata = {
      id: 'all-announcement',
      type: 'click',
      pageid: 'announcement-list'
    };
    this.telemetryInteractObject = {
      id: '',
      type: 'announcement',
      ver: '1.0'
    };
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
