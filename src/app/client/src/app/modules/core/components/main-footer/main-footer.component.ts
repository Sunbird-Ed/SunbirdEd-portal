import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './main-footer.component.html'
})
export class MainFooterComponent implements OnInit {

  date = new Date();
  showFooter = true;

  constructor() { }

  ngOnInit() {
  }

}
