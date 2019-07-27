import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bulk-upload-content',
  templateUrl: './bulk-upload-content.component.html',
  styleUrls: ['./bulk-upload-content.component.scss']
})
export class BulkUploadContentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  close() {
    this.router.navigate(['/workspace/content/create']);
  }

}
