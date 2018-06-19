import { ResourceService } from '../../services';
import { Component, OnInit, Input } from '@angular/core';
import { ContentUtilsServiceService } from '../../services/content-utils/content-utils.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
/**
 * Redirectcomponent is called when the content played is of mimeType text/x-url
 * and when the route learn/redirect is called this component is invoked
 */
export class RedirectComponent implements OnInit {
  constructor(public resourceService: ResourceService, public contentUtilsServiceService: ContentUtilsServiceService) { }
  /**
   * oninit the window opens a new window tab with the redirectUrl values in the url
   */
  ngOnInit() {
    this.contentUtilsServiceService.extLinkData$.subscribe((data) => {
      console.log('extlinkdata', data);
      setTimeout(() => {
        if (data !== undefined) {
          location.href = data;
        } else {
          window.open(window.redirectUrl, '_self');
        }
      }, 5000);
    });
    // setTimeout(() => {
    //   window.open(window.redirectUrl, '_self');
    // }, 500);
  }

  /**
   * Close the window on click of goBack button
   */
  goBack() {
    window.close();
  }
}
