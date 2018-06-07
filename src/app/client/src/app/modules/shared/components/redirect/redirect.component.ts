import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
/**
 * Redirectcomponent is called when the content played is of mimeType text/x-url
 * and when the route lean/redict is called this component is invoked
 */
export class RedirectComponent implements OnInit {
  /**
   * oninit the window opens a new window tab with the redirectUrl values in the url
   */
  ngOnInit() {
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
