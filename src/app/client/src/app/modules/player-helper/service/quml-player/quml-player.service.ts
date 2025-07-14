import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash-es';
import { QuestionCursor } from '@project-sunbird/sunbird-quml-player-v9';
import { EditorCursor } from '@project-sunbird/sunbird-collection-editor';
import { CsModule } from '@project-fmps/client-services';
import { PublicPlayerService } from '@sunbird/public';
import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
@Injectable({ providedIn: 'root' })

export class QumlPlayerService implements QuestionCursor,EditorCursor {
  private questionMap = new Map();
  private contentCsService: any;
  constructor(public csLibInitializerService: CsLibInitializerService,
    public playerService: PublicPlayerService) {
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.contentCsService = CsModule.instance.contentService;
  }

  getQuestion(questionId: string): Observable<any> {
    if (_.isEmpty(questionId)) { return of({}); }
    const question = this.getQuestionData(questionId);
    if (question) {
      return of({ questions: _.castArray(question) });
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

  getQuestionSet(identifier: string) {
    const hierarchy = this.playerService.getQuestionSetHierarchyV1(identifier);
    const questionSetResponse = this.playerService.getQuestionSetReadV1(identifier);

    return forkJoin([hierarchy, questionSetResponse]).pipe(map(res => {
      const questionSet = _.get(res[0], 'questionSet');
      const instructions = _.get(res[1], 'result.questionset.instructions');
      if (questionSet && instructions) {
        questionSet['instructions'] = instructions;
      }
      return { questionSet };
    }));
  }
  getAllQuestionSet(identifiers: string[]): Observable<any> {
    const option = {
      params: {
        fields: 'maxScore'
      }
    };
    const requests = _.map(identifiers, id => {
      return this.playerService.getQuestionSetRead(id, option);
    });
    return forkJoin(requests).pipe(
      map(res => {
        return res.map(item => _.get(item, 'result.questionset.maxScore'));
      })
    );
  }
}
