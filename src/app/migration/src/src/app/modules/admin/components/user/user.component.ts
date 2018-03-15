import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  public redirect() {
    this.router.navigate(['admin/bulkUpload']);
  }

}
