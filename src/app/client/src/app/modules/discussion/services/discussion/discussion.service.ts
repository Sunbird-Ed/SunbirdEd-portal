import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { Injectable } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
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

  // Proxy methods to support Discussion UI which expects these APIs
  fetchAllCategories() {
    return this.discussionCsService.fetchAllCategories && this.discussionCsService.fetchAllCategories();
  }

  fetchSingleCategoryDetails(cid: any) {
    return this.discussionCsService.fetchSingleCategoryDetails && this.discussionCsService.fetchSingleCategoryDetails(cid);
  }

  fetchSingleCategoryDetailsSort(cid: any, sort?: any, page?: any) {
    if (this.discussionCsService.fetchSingleCategoryDetailsSort) {
      return this.discussionCsService.fetchSingleCategoryDetailsSort(cid, sort, page);
    }
    return this.fetchSingleCategoryDetails(cid);
  }

  fetchAllTag() {
    if (this.discussionCsService.fetchAllTag) {
      return this.discussionCsService.fetchAllTag();
    }
    if (this.discussionCsService.fetchAllTags) {
      return this.discussionCsService.fetchAllTags();
    }
    return null;
  }

  contextBasedTags(data: any) {
    return this.discussionCsService.contextBasedTags && this.discussionCsService.contextBasedTags(data);
  }

  fetchPostDetails(...args: any[]) {
    return this.discussionCsService.fetchPostDetails && this.discussionCsService.fetchPostDetails(...args);
  }

  createPost(data: any) {
    return this.discussionCsService.createPost && this.discussionCsService.createPost(data);
  }

  votePost(pid: any, body: any, apiConfig?: any) {
    return this.discussionCsService.votePost && this.discussionCsService.votePost(pid, body, apiConfig);
  }

  deleteVotePost(pid: any) {
    return this.discussionCsService.deleteVotePost && this.discussionCsService.deleteVotePost(pid);
  }

  bookmarkPost(pid: any, body?: any) {
    return this.discussionCsService.bookmarkPost && this.discussionCsService.bookmarkPost(pid, body);
  }

  deleteBookmarkPost(pid: any) {
    return this.discussionCsService.deleteBookmarkPost && this.discussionCsService.deleteBookmarkPost(pid);
  }

  replyPost(...args: any[]) {
    return this.discussionCsService.replyPost && this.discussionCsService.replyPost(...args);
  }

  // Generic passthrough for other methods used by discussion UI
  [method: string]: any;
}
