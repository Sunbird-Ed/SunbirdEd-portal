import { HttpOptions, RequestParam } from '@sunbird/shared';
import { LearnerService } from './../services/learner/learner.service';
import {Observable} from 'rxjs/Observable';

export class MockLearnerService {
    baseUrl = '';
    // config = new ConfigService();
    http = null;
    rootOrgId = '';
    get(options: RequestParam) {
        return Observable.of({});
    }
    post(options: RequestParam) {
        return Observable.of({});
    }
    patch(options: RequestParam) {
        return Observable.of({});
    }
    delete(options: RequestParam) {
        return Observable.of({});
    }
    private getHeader(): HttpOptions['headers'] {
        return {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Consumer-ID': 'X-Consumer-ID',
          'X-Device-ID': 'X-Device-ID',
          'X-Org-code': this.rootOrgId,
          'X-Source': 'web'
        };
    }
}
