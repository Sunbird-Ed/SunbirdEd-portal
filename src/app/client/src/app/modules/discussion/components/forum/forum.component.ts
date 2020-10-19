import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash-es';
import * as  iziModal from 'izimodal/js/iziModal';
import { Location } from '@angular/common';
jQuery.fn.iziModal = iziModal;

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})

export class ForumComponent implements OnInit, OnDestroy {

  discussionUrl: SafeResourceUrl;
  @ViewChild('modal')modal;
  constructor(private userService: UserService, private http: HttpClient,
    public sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute,
    private location: Location) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.closeModal();
  }

  ngOnInit() {
    this.getDiscussionUrl();
  }

  getDiscussionUrl() {
    const userName = _.get(this.userService.userProfile, 'userName');
    this.http.get(`/get/user/sessionId?userName=` + userName).subscribe((data: any) => {
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
