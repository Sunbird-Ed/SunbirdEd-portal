import { UserService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-certificate-dashboard',
  templateUrl: './certificate-dashboard.component.html',
  styleUrls: ['./certificate-dashboard.component.scss']
})
export class CertificateDashboardComponent implements OnInit {
 userId: string;
 data: any;
  constructor( public http: HttpClient, public userService: UserService) { }

  ngOnInit() {
    this.userId = this.userService.userid;
    this.getTableData();
  }

  download(url: string) {
    window.open(url);
  }

  getTableData() {
    this.http.get(`/certificate/user/upload/status/${this.userId}`).subscribe(
      (data) => {
        this.data = _.get(data, 'result.response');
      }, (error) => {

      }
    );
  }
}
