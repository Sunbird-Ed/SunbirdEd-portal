import { TestBed } from '@angular/core/testing';

import { QumlPlayerV2Service } from './quml-player-v2.service';
import { HttpClient } from '@angular/common/http';
import { PublicPlayerService } from '@sunbird/public';
import { questionListResponse, hierarchyResponse, questionsetRead } from './quml-player-v2.service.spec.data'
import { of } from 'rxjs';
import { ConfigService } from '@sunbird/shared';
describe('QumlPlayerV2Service', () => {
  let qumlPlayerV2Service: QumlPlayerV2Service;

  const mockHttpClient: Partial<HttpClient> = {
    get: jest.fn(),
    post: jest.fn().mockImplementation(() => { return of(questionListResponse)})
  };

  const mockPublicPlayerService: Partial<PublicPlayerService> = {
    getQuestionSetHierarchy: jest.fn().mockImplementation(() => {
      return of(hierarchyResponse.result)
    }),
    getQuestionSetRead: jest.fn().mockImplementation(() => {
      return of(questionsetRead)
    })
  }

  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: 'joy',
      TELEMETRY: {
        PID: 'sample-page-id'
      }
    },
    urlConFig: {
      URLS: {
        QUESTIONSET: {
          LIST_API: 'api/question/v2/list'
        }
      }
    }
  };

  beforeAll(() => {
    qumlPlayerV2Service = new QumlPlayerV2Service(
      mockHttpClient as HttpClient,
      mockPublicPlayerService as PublicPlayerService,
      mockConfigService as ConfigService
    );
  });

  it('should be created', () => {
    expect(qumlPlayerV2Service).toBeTruthy();
  });

  it('should return question data', () => {
    const questionId = '123';
    const mockQuestion = { id: questionId, text: 'Sample question' };
    qumlPlayerV2Service.setQuestionMap(questionId, mockQuestion);
    const result = qumlPlayerV2Service.getQuestion(questionId);
    result.subscribe((data) => {
      expect(data.questions).toEqual([mockQuestion]);
    });
  });

  it('should return question data', () => {
    const result = qumlPlayerV2Service.getQuestion('do_2138622565343969281175');
    result.subscribe((data) => {
      expect(data.questions).toBeDefined();
    });
  });

  it('should handle empty question ID', () => {
    const result = qumlPlayerV2Service.getQuestion('');

    result.subscribe((data) => {
      expect(data).toEqual({});
    });
  });

  it('#getQuestions() should return question data', () => {
    const questionIds = ['do_2138622565343969281175'];
    const result = qumlPlayerV2Service.getQuestions(questionIds);
    result.subscribe((data) => {
      expect(data.questions).toBeDefined();
    });
  });

  it('should clear questionMap', () => {
    const questionId = 'do_12345'
    const mockQuestion = { id: questionId, text: 'Sample question' };
    qumlPlayerV2Service.setQuestionMap(questionId, mockQuestion);
    qumlPlayerV2Service.clearQuestionMap();
  });

  it('should return empty observale', () => {
    const result = qumlPlayerV2Service.getAllQuestionSet(['do_12345']);
    result.subscribe((data) => {
      expect(data).toEqual({});
    });
  });

  it('#getQuestionSet() should return questionset data', () => {
    const result = qumlPlayerV2Service.getQuestionSet('do_2138622515299368961170');
    result.subscribe((data) => {
      expect(data.questionSet.instructions).toEqual('<p>Good Luck</p>');
    });
  });

});
