import { QuestionCursor } from '@project-sunbird/sunbird-quml-player-v8';
import { Observable } from 'rxjs';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';

export class QumlPlayerService implements QuestionCursor {

  private contentCsService: any;
  constructor(public csLibInitializerService: CsLibInitializerService) {
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.contentCsService = CsModule.instance.contentService;
  }

  getQuestion(questionId: string): Observable<any> {
    return this.contentCsService.getQuestionList([questionId]);
  }

  getQuestions(questionIds: string[]): Observable<any> {
    return this.contentCsService.getQuestionList(questionIds);
  }
}
