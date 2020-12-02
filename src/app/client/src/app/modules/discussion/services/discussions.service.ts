import { Injectable } from '@angular/core';
import { DiscussionsForumService } from '@sunbird/core';

@Injectable({
  providedIn: 'root'
})
export class DiscussionsService {

  constructor(public discussionsForumService: DiscussionsForumService) { }

  getUser(userId) {
    const option = {
      url : `user/username/${userId}`
    };
    return this.discussionsForumService.get(option);
  }


  createUser(userId) {
    const option = {
      url : `v2/users`,
      data: { username: userId }
    };
    return this.discussionsForumService.post(option);
  }
}
