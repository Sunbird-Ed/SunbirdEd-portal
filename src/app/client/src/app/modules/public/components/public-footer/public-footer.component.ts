import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

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

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

}
