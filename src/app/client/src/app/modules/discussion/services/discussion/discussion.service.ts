import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { Injectable } from '@angular/core';
import { CsModule } from '@project-fmps/client-services';
import { FormService } from '@sunbird/core';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  discussionCsService: any;

  constructor(
    private csLibInitializerService: CsLibInitializerService,
    private formService: FormService
  ) {
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.discussionCsService = CsModule.instance.discussionService;
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
}
