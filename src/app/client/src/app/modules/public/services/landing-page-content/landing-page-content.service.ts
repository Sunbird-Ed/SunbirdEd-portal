import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LandingPageContentService {

  constructor(private http: HttpClient) { }

  getPageContent(){
    return this.http.get('/landingpageContent');
  }

}
