import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService, UserService } from '@sunbird/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import {
  ConfigService, IUserData, ResourceService, ToasterService,
  WindowScrollService, NavigationHelperService, PlayerConfig, ContentData
} from '@sunbird/shared';
import { PublicPlayerService } from './../../services';

@Component({
  selector: 'app-public-content-player',
  templateUrl: './public-content-player.component.html',
  styleUrls: ['./public-content-player.component.css']
})
export class PublicContentPlayerComponent implements OnInit {
  /**
   * content id
   */
  contentId: string;
  /**
   * contains player configuration
   */
  playerConfig: PlayerConfig;
  /**
   * Flag to show player
   */
  showPlayer = false;
  /**
   * Flag to show error
   */
  showError = false;
  /**
   * contain error message
   */
  errorMessage: string;
  /**
   * contain contentData
   */
  selectedLanguage: string;
  queryParams: any;
  contentData: ContentData;
  constructor(public activatedRoute: ActivatedRoute, public userService: UserService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public windowScrollService: WindowScrollService, public playerService: PublicPlayerService,
    public navigationHelperService: NavigationHelperService
  ) {
  }
  /**
   *
   * @memberof ContentPlayerComponent
   */
  ngOnInit() {
    Observable
      .combineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      (params: any, queryParams: any) => {
        return {
          params: params,
          queryParams: queryParams
        };
      })
      .subscribe(bothParams => {
        this.contentId = bothParams.params.contentId;
        this.getContent();
        this.queryParams = { ...bothParams.queryParams };
        if (this.queryParams['language'] && this.queryParams['language'] !== this.selectedLanguage) {
          this.selectedLanguage = this.queryParams['language'];
          this.resourceService.getResource(this.selectedLanguage);
        }
      });
  }
  /**
   * used to fetch content details and player config. On success launches player.
   */
  getContent() {
    this.playerService.getContent(this.contentId).subscribe(
      (response) => {
        const contentDetails = {
          contentId: this.contentId,
          contentData: response.result.content
        };
        this.playerConfig = this.playerService.getConfig(contentDetails);
        this.contentData = response.result.content;
        this.showPlayer = true;
        this.windowScrollService.smoothScroll('content-player');
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
  close() {
    this.navigationHelperService.navigateToResource('/explore/1');
  }
}
