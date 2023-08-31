import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoursePageContentService {

  constructor(private http: HttpClient) { }

  getCoursePageContent(){
    return this.http.get('/coursePageContent');
  }
}