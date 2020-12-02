import { ConfigService } from '@sunbird/shared';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LearnerService } from '@sunbird/core';
import { Component, OnInit, OnDestroy, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import * as  iziModal from 'izimodal/js/iziModal';
import { Location } from '@angular/common';
jQuery.fn.iziModal = iziModal;

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})

export class ForumComponent implements OnInit, OnDestroy, AfterViewInit {

  discussionUrl: SafeResourceUrl;
  @ViewChild('modal')modal;
  constructor(
    public sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute,
    private location: Location, private config: ConfigService,
    private learnerService: LearnerService) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.closeModal();
  }

  ngOnInit() {
    this.getDiscussionUrl();
  }

  ngAfterViewInit() {
    document.body.className = 'o-y-auto';
  }

  getDiscussionUrl() {
    const option = {
      url: this.config.urlConFig.URLS.USER.GET_SESSION
    };
    this.learnerService.get(option).subscribe((data: any) => {
      this.discussionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `discussions/auth/sunbird-oidc/callback${data.id}&returnTo=/category/${_.get(this.activatedRoute.snapshot, 'queryParams.forumId')}`
      );
    });
  }

  navigateToPreviousPage() {
    this.location.back();
  }

  closeModal() {
    if (this.modal) {
      this.modal.deny();
    }
  }

  ngOnDestroy() {
    this.closeModal();
  }

}
