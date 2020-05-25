import {Injectable} from '@angular/core';
import {ConfigService} from '@sunbird/shared';
import {HttpClient} from '@angular/common/http';
import {LearnerService} from '../learner/learner.service';

@Injectable({
  providedIn: 'root'
})
export class ManagedUserService {

  constructor(public configService: ConfigService, private http: HttpClient,
              private learnerService: LearnerService) {
  }

  public fetchManagedUserList(request) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.SEARCH_USER,
      data: request,
    };
    return this.learnerService.post(options);
  }

  public initiateSwitchUser(userId) {
    const url = this.configService.urlConFig.URLS.USER.SWITCH_USER + '/' + userId;
    return this.http.get(url);
  }
}
