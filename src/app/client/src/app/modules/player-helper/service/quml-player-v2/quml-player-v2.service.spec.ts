import { TestBed } from '@angular/core/testing';

import { QumlPlayerV2Service } from './quml-player-v2.service';
import { HttpClient } from '@angular/common/http';
import { questionListResponse } from './quml-player-v2.service.spec.data'
import { of } from 'rxjs';
describe('QumlPlayerV2Service', () => {
  let qumlPlayerV2Service: QumlPlayerV2Service;

  const mockHttpClient: Partial<HttpClient> = {
    get: jest.fn(),
    post: jest.fn().mockImplementation(() => { return of(questionListResponse)})
  };

  beforeAll(() => {
    qumlPlayerV2Service = new QumlPlayerV2Service(
      mockHttpClient as HttpClient
    );
  });

  it('should be created', () => {
    expect(qumlPlayerV2Service).toBeTruthy();
  });

  it('should clear questionMap', () => {
    const questionId = 'do_12345'
    const mockQuestion = { id: questionId, text: 'Sample question' };
    qumlPlayerV2Service.setQuestionMap(questionId, mockQuestion);
    qumlPlayerV2Service.clearQuestionMap();
  });

});
