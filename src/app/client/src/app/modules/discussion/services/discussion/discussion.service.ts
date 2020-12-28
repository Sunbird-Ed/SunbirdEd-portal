import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { Injectable } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  private discussionCsService: any;

  constructor(
    private csLibInitializerService: CsLibInitializerService
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
}
