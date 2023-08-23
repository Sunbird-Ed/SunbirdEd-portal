import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// const envHelper = require('../../../../../../../helpers/environmentVariablesHelper.js');

@Injectable({
  providedIn: 'root'
})
export class LearnPageContentService {

  // competencyApiUrl = envHelper.CONTENT_URL;
  competencyApiUrl = 'https://compass-dev.tarento.com/api/content/v1';

  constructor(private http: HttpClient) { }

  getPageContent(){
    console.log("hi");
    return this.http.get('/learnLandingPageContent');
  }

  getBrowseByCompetencyData(data: any){
    return this.http.post(`${this.competencyApiUrl}/search?orgdetails=orgName,email&licenseDetails=name,description,url`, data);
  }
}
