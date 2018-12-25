import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './main-footer.component.html'
})
export class MainFooterComponent implements OnInit {
  /*
  Date to show copyright year
  */
  date = new Date();
  /*
  Hide or show footer
  */
  showFooter = true;

  constructor() { }

  ngOnInit() {
  }

}
