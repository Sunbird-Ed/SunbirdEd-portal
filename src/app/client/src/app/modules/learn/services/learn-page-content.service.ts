import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LearnPageContentService {

  constructor(private http: HttpClient) { }

  getLearnPageContent(){
    return this.http.get('/learnPageContent');
  }

}
