import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingPageContentService {

  apiUrl = 'https://compass-dev.tarento.com/api/content/v1';

  constructor(private http: HttpClient) { }

  getPageContent(){
    return this.http.get('/landingpageContent');
  }

  getCourses(data: any){
    return this.http.post(`${this.apiUrl}/search?orgdetails=orgName,email`, data);
  }

}