import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { Injectable } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
import { FormService } from '@sunbird/core';
import { QuestionCursor } from 'quml-player';






@Injectable({
  providedIn: 'root'
})




// export class abc extends QuestionCursor {

  
  
// }



export class DiscussionService extends QuestionCursor{

  private discussionCsService: any;
  private contentCsService: any;

  constructor(
    private csLibInitializerService: CsLibInitializerService,
    private formService: FormService
  ) {
    super();
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.discussionCsService = CsModule.instance.discussionService;
    this.contentCsService = CsModule.instance.contentService;
  }


  getQuestion() {

  }

  getQuestions() {
    
  }
  

  registerUser(data) {
    return this.discussionCsService.createUser(data);
  }

  getUserDetails(userId) {
    return this.discussionCsService.getUserDetails(userId);
  }

  getForumIds(data) {
    return this.discussionCsService.getForumIds(data);
  }

  attachForum(data) {
    return this.discussionCsService.attachForum(data);
  }

  removeForum(data) {
    return this.discussionCsService.removeForum(data);
  }

  createForum(data) {
    return this.discussionCsService.createForum(data);
  }

  fetchForumConfig(contentType) {
    const formServiceInputParams = {
      formType: 'forum',
      formAction: 'create',
      contentType: contentType
    };
    return this.formService.getFormConfig(formServiceInputParams);
  }

  getQuestionSetHierarchy(data) {
    return this.contentCsService.getQuestionSetHierarchy(data);
  }

  getQuestionList(data) {
    return this.contentCsService.getQuestionList(data);
  }
}
