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
      // title: '',
      iframe: true,
      iframeURL: `https://dev.sunbirded.org/discussions/auth/sunbird-oidc/callback${data.id}&returnTo=/category/15`,
      // navigateArrows: false,
      fullscreen: true,
      openFullscreen: true,
      // closeOnEscape: false,
      // overlayClose: false,
      // overlay: false,
      // overlayColor: '',
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
    // this.showLoader = true;
    if (document.getElementById('discussionIframe')) {
      document.getElementById('discussionIframe').remove();
    }
}

}
