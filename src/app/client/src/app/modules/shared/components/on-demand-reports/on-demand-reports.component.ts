import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/index';
@Component({
  selector: 'app-on-demand-reports',
  templateUrl: './on-demand-reports.component.html',
  styleUrls: ['./on-demand-reports.component.scss']
})
export class OnDemandReportsComponent implements OnInit {

  reportTypes = [];
  // @Input() formConfig;
  // @Input() tag;
  constructor(public resourceService : ResourceService) {
  }

  ngOnInit() {
  }

}
