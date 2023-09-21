import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingPageContentService {

  constructor(private http: HttpClient) { }

  getPageContent(){
    return this.http.get('/landingpageContent');
  }

  // getCourses(data: any){
  //   return this.http.post(`/api/content/v1/search?orgdetails=orgName,email`, data);
  // }

}