import { Injectable } from '@angular/core';
import { DataService } from './../../core/services/data/data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewCommentsService extends DataService {

  baseUrl: string;

  constructor( http: HttpClient) {
    super(http);
    this.baseUrl = '/mock';
  }

  getThreadList (data) {
    const option = {
      url: '/v1/thread/list',
      data: data
    };
    return this.post(option);
  }

  createThread (data) {
    const option = {
      url: '/v1/thread/create',
      data: data
    };
    return this.post(option);
  }
}
