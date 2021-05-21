import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash-es';
import { QuestionCursor } from '@project-sunbird/sunbird-quml-player-v8';
import { EditorCursor } from '@project-sunbird/sunbird-collection-editor';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
@Injectable({ providedIn: 'root' })

export class QumlPlayerService implements QuestionCursor, EditorCursor {
  private questionMap =  new Map();
  private contentCsService: any;
  constructor(public csLibInitializerService: CsLibInitializerService) {
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.contentCsService = CsModule.instance.contentService;
  }

  getQuestion(questionId: string): Observable<any> {
    if (_.isEmpty(questionId)) { return of({}); }
    const question = this.getQuestionData(questionId);
    if (question) {
        return of({questions : _.castArray(question)});
    } else {
        return this.contentCsService.getQuestionList(_.castArray(questionId));
    }
  }

  getQuestions(questionIds: string[]): Observable<any> {
    return this.contentCsService.getQuestionList(questionIds);
  }

  getQuestionData(questionId) {
    return this.questionMap.get(_.first(_.castArray(questionId))) || undefined;
  }

  setQuestionMap(key, value) {
    this.questionMap.set(key, value);
  }

  clearQuestionMap() {
    this.questionMap.clear();
  }

}