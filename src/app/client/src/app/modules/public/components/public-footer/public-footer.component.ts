import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-public-footer',
  templateUrl: './public-footer.component.html',
  styleUrls: ['./public-footer.component.css']
})
export class PublicFooterComponent implements OnInit {

  /**
* content is used to render IContents value on the view
*/
@Input() instanceName: string;
/**
* to show the footer bar
*/
appFooter = true;

  constructor() { }

  ngOnInit() {
  }

}
