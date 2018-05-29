import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  ngOnInit() {
    setTimeout(() => {
      window.open(window.redirectUrl, '_self');
    }, 500);

  }

  goBack() {
    window.close();
  }

}
