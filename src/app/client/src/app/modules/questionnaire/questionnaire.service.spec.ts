import { TestBed } from '@angular/core/testing';

import { QuestionnaireService } from './questionnaire.service';

xdescribe('QuestionnaireService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionnaireService = TestBed.get(QuestionnaireService);
    expect(service).toBeTruthy();
  });
});
