import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LearnPageContentService {

  constructor(private http: HttpClient) { }

  getPageContent(){
    console.log("hi");
    return this.http.get('/learnLandingPageContent');
  }
}
