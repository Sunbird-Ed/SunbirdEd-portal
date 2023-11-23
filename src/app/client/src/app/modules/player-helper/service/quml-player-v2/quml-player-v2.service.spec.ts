import { TestBed } from '@angular/core/testing';

import { QumlPlayerV2Service } from './quml-player-v2.service';
import { HttpClient } from '@angular/common/http';
import { PublicPlayerService } from '@sunbird/public';

describe('QumlPlayerV2Service', () => {
  let qumlPlayerV2Service: QumlPlayerV2Service;

  const mockHttpClient: Partial<HttpClient> = {
    get: jest.fn(),
    post: jest.fn().mockImplementation(() => { })
  };

  const mockPublicPlayerService: Partial<PublicPlayerService> = {}

  beforeAll(() => {
    qumlPlayerV2Service = new QumlPlayerV2Service(
      mockHttpClient as HttpClient,
      mockPublicPlayerService as PublicPlayerService
    );
  });


  beforeEach(() => {
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

  it('should handle empty question ID', () => {
    const result = qumlPlayerV2Service.getQuestion('');

    result.subscribe((data) => {
      expect(data).toEqual({});
    });
  });
});
