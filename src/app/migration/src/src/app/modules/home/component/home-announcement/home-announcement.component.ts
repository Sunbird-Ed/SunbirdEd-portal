import { Component, OnInit, Input } from '@angular/core';
// Import services
import { AnnouncementService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';



/**
 * HomeAnnouncementComponent displays announcement inbox card
 */
@Component({
  selector: 'app-home-announcement',
  templateUrl: './home-announcement.component.html',
  styleUrls: ['./home-announcement.component.css']
})
/**
 *  HomeAnnouncementComponent
 * interact with announcement inbox data.
 */
export class HomeAnnouncementComponent implements OnInit {
  /**
   * Property of ResourceService used to render resourcebundels.
   */
  resourceService: ResourceService;
  /**
   * Property of AnnouncementService used to render announcement inbox detail.
   */
  announcement: AnnouncementService;
  /**
   *  Contains announcement inbox details
   */
  listData: Array<any> = [];
  /**
  * Contains page limit of inbox list
  */
  pageLimit: 2;

  /**
   * Contains page number of inbox list
   */
  pageNumber: number;
  /**
   * Flags to show loader
   */
  showLoader = true;
  /**
   * Flags to show div
   */
  showdiv = false;
  /**
   * Loader message
   */
  loaderMessage = {
    headerMessage: '',
    loaderMessage: 'We are Fetching Details ...'
  };

  /**
    * Constructor
    * inject service(s)
    * @param {ResourceService} resourceService  ResourceService used to render resourcebundels.
    * @param {AnnouncementService} announcement AnnouncementService used to render announcement inbox detail.
   */
  constructor(resourceService: ResourceService, announcement: AnnouncementService) {
    this.resourceService = resourceService;
    this.announcement = announcement;
  }

  /**
   * getInbox is subscribe to announcement service to get api response.
   */
  public getInbox() {
    const option = {
      pageNumber: this.pageNumber,
      limit: this.pageLimit
    };
    this.announcement.getInboxList(option).subscribe(
      res => {
        if (res && res.result.count > 0) {
          this.listData = res.result.announcements;
          this.showdiv = true;
          console.log('service', res);
        }
        this.showLoader = false;
      },
      err => {
        console.log('show error');
        this.showLoader = false;
      });
  }

  /**
   * Initialize getInbox
   */
  ngOnInit() {
    this.getInbox();
  }

}
