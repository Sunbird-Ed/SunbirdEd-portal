import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  public bulkOrgProcessId: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    this.bulkOrgProcessId = false;
  }
  public redirect() {
    this.router.navigate(['admin/bulkUpload']);
  }

}
