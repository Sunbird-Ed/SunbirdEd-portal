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
  sortOrder:string;
  reverse:boolean = true;
  constructor(public http: HttpClient, public userService: UserService) { }
  ngOnInit() {
    this.userId = this.userService.userid;
    this.getTableData();
  }

  downloadCert(url: string) {
    //TODO call the API to GET the signed URL and then download the zip file
    window.open(url,'_blank');
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
        this.data = this.data.sort((a,b) => +moment(a.createdon) - +moment(b.createdon));
        _.forEach(this.data, function(value) {
            value['createdon'] = moment(value['createdon']).format('DD/MM/YYYY HH:mm');
        });
        this.data = _.reverse(this.data);
      }, (error) => {

      }
    );
  }
  /**
  * To method helps to set order of a specific field
  *
	* @param {string} value Field name that is to be sorted
  */
  setOrder(value: string): void {
    this.reverse = !this.reverse;
    this.sortOrder = this.reverse ? 'desc' : 'asc';
    if(value === 'createdon'){
      this.data = _.reverse(this.data);
    } else{
      this.data = _.orderBy(this.data, ['status'],this.sortOrder);
    }
  }
}
