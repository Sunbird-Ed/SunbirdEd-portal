
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { of as observableOf, of, throwError as observableThrowError } from 'rxjs';
import { CoreModule, LearnerService, PublicDataService, UserService } from '@sunbird/core';
import { ConfigService, SharedModule } from '@sunbird/shared';
import { QumlPlayerService } from './quml-player.service';
describe('qumlPlayerService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [QumlPlayerService, ConfigService]
    });
  });

  it('should create qumlPlayerService', () => {
    const service: QumlPlayerService = TestBed.get(QumlPlayerService);
    expect(service).toBeTruthy();
  });

  it('#getQuestion() should return empty obj when questionId not passed', () => {
    const qumlPlayerService = TestBed.get(QumlPlayerService);
    qumlPlayerService.getQuestion().subscribe((data) => {
        expect(data).toEqual({});
    });
  });

  it('#getQuestion() should return the question matching the provided ID', () => {
    const qumlPlayerService = TestBed.get(QumlPlayerService);
    spyOn(qumlPlayerService, 'getQuestionData').and.callThrough();
    qumlPlayerService.setQuestionMap('do_1234', { name : 'Question 1' });
    qumlPlayerService.getQuestion('do_1234').subscribe((data) => {
      expect(data).toEqual({questions : [{ name : 'Question 1' }]});
    });
    expect(qumlPlayerService.getQuestionData).toHaveBeenCalledWith('do_1234');
  });

  xit('#getQuestion() should make API call if it does not find a questionId in the questionMap', () => {
    const qumlPlayerService = TestBed.get(QumlPlayerService);
    spyOn(qumlPlayerService, 'getQuestionData').and.callThrough();
    qumlPlayerService.clearQuestionMap();
    qumlPlayerService.getQuestion('do_1234').subscribe((data) => {
      console.log('data' , data);
      expect(data).toEqual({questions : [{ name : 'Question 1' }]});
    });
    expect(qumlPlayerService.getQuestionData).toHaveBeenCalledWith('do_1234');
  });

  xit('#getQuestions() should fetch the question list', () => {
    const qumlPlayerService = TestBed.get(QumlPlayerService);
    qumlPlayerService.getQuestions(['do_123']);
  });

  it('#setQuestionMap() should set question data', () => {
    const qumlPlayerService = TestBed.get(QumlPlayerService);
    qumlPlayerService.setQuestionMap('do_1234', { name : 'Question 1' });
    expect(qumlPlayerService.getQuestionData('do_1234')).toEqual({ name : 'Question 1' });
  });

  it('#getQuestionData() should return the question data matching the provided ID', () => {
    const qumlPlayerService = TestBed.get(QumlPlayerService);
    qumlPlayerService.setQuestionMap('do_1234', { name : 'Question 1' });
    const questiondata = qumlPlayerService.getQuestionData('do_1234');
    expect(questiondata).toEqual({ name : 'Question 1' });
  });

  it('should return #undefined if it does NOT find a question data matching the provided ID', () => {
    const qumlPlayerService = TestBed.get(QumlPlayerService);
    qumlPlayerService.setQuestionMap('do_1234', { name : 'Question 1' });
    const questiondata = qumlPlayerService.getQuestionData('do_1111');
    expect(questiondata).toBeUndefined();
  });

  it('#clearQuestionMap() should clear question map', () => {
    const qumlPlayerService = TestBed.get(QumlPlayerService);
    qumlPlayerService.clearQuestionMap();
  });

});
