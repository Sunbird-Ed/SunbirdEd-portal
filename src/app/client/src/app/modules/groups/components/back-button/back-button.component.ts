import { Location } from '@angular/common';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {

  constructor( public resourceService: ResourceService, private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
