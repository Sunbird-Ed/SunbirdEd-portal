
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { CourseProgressService } from '../courseProgress/course-progress.service';
import { Injectable } from '@angular/core';
import { _ } from 'lodash-es';
import { Md5 } from 'md5';
// import { dayjs } from 'dayjs';
import { finalize } from 'rxjs/operators';
import { AssessmentScoreService } from './assessment-score.service';

describe('AssessmentScoreService', () => {
    let component: AssessmentScoreService;

    const courseProgressService :Partial<CourseProgressService> ={};

    beforeAll(() => {
        component = new AssessmentScoreService(
            courseProgressService as CourseProgressService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
});