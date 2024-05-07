import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EditorCursor } from '@project-sunbird/sunbird-questionset-editor';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})

export class QumlPlayerV2Service implements EditorCursor {
  public questionMap =  new Map();
  constructor(private http: HttpClient) {} // @Inject(HttpClient)

  getQuestionData(questionId) {
    return this.questionMap.get(_.first(_.castArray(questionId))) || undefined;
  }

  setQuestionMap(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  removeQuestionMap(key) {
    sessionStorage.removeItem(key);
  }

  clearQuestionMap() {
    this.questionMap.clear();
  }
}