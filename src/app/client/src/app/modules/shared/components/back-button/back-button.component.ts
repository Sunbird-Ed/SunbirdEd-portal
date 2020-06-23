import { ResourceService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { NavigationHelperService } from '../../services';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {

  constructor(private navigationHelperService: NavigationHelperService, public resourceService: ResourceService) { }

  ngOnInit() {
  }
  goBack() {
    this.navigationHelperService.goBack();
  }
}
