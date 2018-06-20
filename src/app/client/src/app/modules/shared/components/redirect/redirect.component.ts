import { ResourceService } from '../../services';
import { Component, OnInit, Input } from '@angular/core';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';

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
  constructor(public resourceService: ResourceService, activatedRoute: ActivatedRoute) {
    this.activatedRoute = activatedRoute;
  }
  /**
   * oninit the window opens a new window tab with the redirectUrl values in the url
   */
  ngOnInit() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.activatedRoute.snapshot.data.telemetry.uri + '/' + this.activatedRoute.snapshot.params.pageNumber,
        visits: []
      }
    };
    setTimeout(() => {
      window.open(window.redirectUrl, '_self');
    }, 500);
  }

  /**
   * Close the window on click of goBack button
   */
  goBack() {
    window.close();
  }
}
