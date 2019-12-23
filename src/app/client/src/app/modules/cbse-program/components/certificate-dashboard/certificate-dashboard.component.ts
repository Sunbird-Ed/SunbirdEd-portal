import { UserService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash-es';
import * as moment from 'moment';
@Component({
  selector: 'app-certificate-dashboard',
  templateUrl: './certificate-dashboard.component.html',
  styleUrls: ['./certificate-dashboard.component.scss']
})
export class CertificateDashboardComponent implements OnInit {
  userId: string;
  data: any;
  constructor(public http: HttpClient, public userService: UserService) { }

  ngOnInit() {
    this.userId = this.userService.userid;
    this.getTableData();
  }

  downloadCert(url: string) {
    window.open(url, '_blank');
  }

  getTableData() {
    const request = {
      'request': {
        'userId': this.userId
      }
    };
    this.http.post('/certificate/user/upload/status', request).subscribe(
      (data) => {
        this.data = _.get(data, 'result.response');
        _.forEach(this.data, value => {
          value['createdon'] = moment(value['createdon']).format('DD/MM/YYYY HH:mm');
        });
       this.data = _.sortBy(this.data, ['createdon']);
      }, (error) => {

      }
    );
  }
}
