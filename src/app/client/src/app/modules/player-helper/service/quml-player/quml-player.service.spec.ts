
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { of as observableOf, of, throwError as observableThrowError } from 'rxjs';
import { CoreModule, LearnerService, PublicDataService, UserService } from '@sunbird/core';
import { RouterModule } from '@angular/router';
import { ConfigService, SharedModule } from '@sunbird/shared';
import { QumlPlayerService } from './quml-player.service';
// service xdescribe
xdescribe('qumlPlayerService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot(), RouterModule.forRoot([])],
      providers: [QumlPlayerService, ConfigService]
    });
  });

  it('should create qumlPlayerService', () => {
    const service: QumlPlayerService= <any> TestBed.inject(QumlPlayerService);
    expect(service).toBeTruthy();
  });

  it('#getQuestion() should return empty obj when questionId not passed', () => {
    const qumlPlayerService= <any> TestBed.inject(QumlPlayerService);
    qumlPlayerService.getQuestion().subscribe((data) => {
        expect(data).toEqual({});
    });
  });

  it('#getQuestion() should return the question matching the provided ID', () => {
    const qumlPlayerService= <any> TestBed.inject(QumlPlayerService);
    spyOn(qumlPlayerService, 'getQuestionData').and.callThrough();
    qumlPlayerService.setQuestionMap('do_1234', { name : 'Question 1' });
    qumlPlayerService.getQuestion('do_1234').subscribe((data) => {
      expect(data).toEqual({questions : [{ name : 'Question 1' }]});
    });
    expect(qumlPlayerService.getQuestionData).toHaveBeenCalledWith('do_1234');
  });

  //  OLD XIT
 xit('#getQuestion() should make API call if it does not find a questionId in the questionMap', () => {
    const qumlPlayerService= <any> TestBed.inject(QumlPlayerService);
    spyOn(qumlPlayerService, 'getQuestionData').and.callThrough();
    qumlPlayerService.clearQuestionMap();
    qumlPlayerService.getQuestion('do_1234').subscribe((data) => {
      expect(data).toEqual({questions : [{ name : 'Question 1' }]});
    });
    expect(qumlPlayerService.getQuestionData).toHaveBeenCalledWith('do_1234');
  });

  //  OLD XIT
 xit('#getQuestions() should fetch the question list', () => {
    const qumlPlayerService= <any> TestBed.inject(QumlPlayerService);
    qumlPlayerService.getQuestions(['do_123']);
  });

  it('#setQuestionMap() should set question data', () => {
    const qumlPlayerService= <any> TestBed.inject(QumlPlayerService);
    qumlPlayerService.setQuestionMap('do_1234', { name : 'Question 1' });
    expect(qumlPlayerService.getQuestionData('do_1234')).toEqual({ name : 'Question 1' });
  });

  it('#getQuestionData() should return the question data matching the provided ID', () => {
    const qumlPlayerService= <any> TestBed.inject(QumlPlayerService);
    qumlPlayerService.setQuestionMap('do_1234', { name : 'Question 1' });
    const questiondata = qumlPlayerService.getQuestionData('do_1234');
    expect(questiondata).toEqual({ name : 'Question 1' });
  });

  it('should return #undefined if it does NOT find a question data matching the provided ID', () => {
    const qumlPlayerService= <any> TestBed.inject(QumlPlayerService);
    qumlPlayerService.setQuestionMap('do_1234', { name : 'Question 1' });
    const questiondata = qumlPlayerService.getQuestionData('do_1111');
    expect(questiondata).toBeUndefined();
  });

  it('#clearQuestionMap() should clear question map', () => {
    const qumlPlayerService= <any> TestBed.inject(QumlPlayerService);
    qumlPlayerService.clearQuestionMap();
  });
  it('#getAllQuestionSet() should make API call to get the maxScore of given identifiers ', () => {
    const qumlPlayerService= <any> TestBed.inject(QumlPlayerService);
    spyOn(qumlPlayerService, 'getAllQuestionSet').and.callThrough();
    qumlPlayerService.getAllQuestionSet(['do_1234', 'do_1235']).subscribe((data) => {
      expect(data).toEqual({result : { questionSet : { maxScore : '1'} }});
    });
    expect(qumlPlayerService.getAllQuestionSet).toHaveBeenCalledWith(['do_1234', 'do_1235']);
  });

});
