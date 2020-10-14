import { UserService } from '@sunbird/core';
import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash-es';
import * as  iziModal from 'izimodal/js/iziModal';
jQuery.fn.iziModal = iziModal;

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})

export class ForumComponent implements OnInit {

  constructor( private userService: UserService, private http: HttpClient,
    private _zone: NgZone) { }

  ngOnInit() {
      this.initEditor();
  }

  initEditor() {
    const userName = _.get(this.userService.userProfile, 'userName');
    this.http.get(`/get/user/sessionId?userName=` + userName).subscribe((data: any) => {

    jQuery('#discussionIframe').iziModal({
      iframe: true,
      iframeURL: `/discussions/auth/sunbird-oidc/callback${data.id}&returnTo=/category/15`,
      fullscreen: true,
      openFullscreen: true,
      closeButton: true,
      overlayClose: true,
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
      jQuery('#discussionIframe').iziModal('close');
    }
}

}
