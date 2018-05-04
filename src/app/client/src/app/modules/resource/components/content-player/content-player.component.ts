import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService, UserService, PlayerService, PlayerConfig, ContentData } from '@sunbird/core';
import * as _ from 'lodash';
import { ConfigService, IUserData, ResourceService, ToasterService,
  WindowScrollService, NavigationHelperService } from '@sunbird/shared';

@Component({
  selector: 'app-content-player',
  templateUrl: './content-player.component.html',
  styleUrls: ['./content-player.component.css']
})
export class ContentPlayerComponent implements OnInit {
  params: {[key: string]: any; };
  playerConfig: PlayerConfig;
  showIFrameContent = false;
  showError = false;
  errorMessage: string;
  contentData: ContentData;
  constructor(public activatedRoute: ActivatedRoute, public location: Location, public navigationHelperService: NavigationHelperService,
    public userService: UserService, public resourceService: ResourceService, public router: Router,
    public toasterService: ToasterService, public windowScrollService: WindowScrollService, public playerService: PlayerService) {
  }
  /**
   *
   * @memberof ContentPlayerComponent
   */
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.params = params;
      this.userService.userData$.subscribe(
        (user: IUserData) => {
          if (user && !user.err) {
            this.getContent();
          }
      });
    });
  }
  /**
   * used to fetch content details and player config. On success launches player.
   * @memberof ContentPlayerComponent
   */
  getContent() {
    this.playerService.getContent(this.params.contentId).subscribe(
      (response) => {
        if (response.result.content.status === 'Live' || response.result.content.status === 'Unlisted') {
          const contentDetails = {
            contentId: this.params.contentId,
            contentData: response.result.content
          };
          this.playerConfig = this.playerService.getContentPlayerConfig(contentDetails);
          this.contentData = response.result.content;
          this.windowScrollService.smoothScroll('content-player');
        } else {
          this.toasterService.warning(this.resourceService.messages.imsg.m0027);
          this.close();
        }
      },
      (err) => {
        this.showError = true;
        this.errorMessage = this.resourceService.messages.stmsg.m0009;
    });
  }
  /**
   * retry launching player with same content details
   * @memberof ContentPlayerComponent
   */
  tryAgain() {
    this.showError = false;
    this.getContent();
  }
  /**
   * closes conent player and revert to previous url
   * @memberof ContentPlayerComponent
   */
  close () {
    const previousUrl = this.navigationHelperService.getPreviousUrl();
    if (previousUrl === 'home') {
      this.router.navigate(['resources']);
    } else {
      this.router.navigate([previousUrl]);
    }
  }
}
