import { ResourceService } from '../../services';
import { Component, OnInit, Input } from '@angular/core';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html'
})

/**
 * Redirectcomponent is called when the content played is of mimeType text/x-url
 * and when the route learn/redirect is called this component is invoked
 */
export class RedirectComponent implements OnInit {
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
   */
  private activatedRoute: ActivatedRoute;
  /**
   * telemetryImpression
   */
  telemetryImpression: IImpressionEventInput;
  constructor(public resourceService: ResourceService, activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute = activatedRoute;
    this.router = router;
  }
  /**
   * oninit the window opens a new window tab with the redirectUrl values in the url
   */
  ngOnInit() {
    console.log('this.activatedRoute.snapshot.data.telemetry', this.activatedRoute.snapshot.data.telemetry);
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        target: window.redirectUrl
      }
    };
    setTimeout(() => {
      window.open(window.redirectUrl, '_self');
    }, 3000);
  }

  /**
   * Close the window on click of goBack button
   */
  goBack() {
    window.close();
  }
}
