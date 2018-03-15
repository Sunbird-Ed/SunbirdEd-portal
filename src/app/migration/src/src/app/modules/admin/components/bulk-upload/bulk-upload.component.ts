import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }
  public uploadOrg() {
    console.log('inside uploadOrg');
    this.router.navigate(['uploadOrg'], { relativeTo: this.route });
  }
  public uploadUser() {
    console.log('inside uploadOrg');
    this.router.navigate(['uploadUser'], { relativeTo: this.route });
  }

}
