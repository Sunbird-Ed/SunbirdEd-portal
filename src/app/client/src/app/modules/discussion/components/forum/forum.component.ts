import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { Component, OnInit, NgZone, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash-es';
import * as  iziModal from 'izimodal/js/iziModal';
jQuery.fn.iziModal = iziModal;

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})

export class ForumComponent implements OnInit, OnDestroy {



  constructor(private userService: UserService, private http: HttpClient,
    private _zone: NgZone, private router: Router, private activatedRoute: ActivatedRoute) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.closeModal();
  }

  ngOnInit() {
    this.initEditor();
  }

  initEditor() {
    const userName = _.get(this.userService.userProfile, 'userName');
    this.http.get(`/get/user/sessionId?userName=` + userName).subscribe((data: any) => {
      jQuery('#discussionIframe').iziModal({
        iframe: true,
        iframeURL: `/discussions/auth/sunbird-oidc/callback${data.id}&returnTo=/category/15`,
        history: false,
        onClosing: () => {
          this._zone.run(() => {
            this.closeModal();
          });
        }
      }).iziModal('open');
    });
  }

  public closeModal() {
    if (document.getElementById('discussionIframe')) {
      document.getElementById('discussionIframe').remove();
      jQuery('#discussionIframe').iziModal('close');
    }
  }

  navigateToPreviousPage() {
    this.router.navigate([], { relativeTo: this.activatedRoute.parent });
  }

  ngOnDestroy() {
    this.closeModal();
  }

}
