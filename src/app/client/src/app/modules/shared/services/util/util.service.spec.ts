import { TestBed, inject } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService]
    });
  });

  it('should be created', inject([UtilService], (service: UtilService) => {
    expect(service).toBeTruthy();
  }));
  it('should call manipulateSoftConstraint when filter matches with softConstraintFilter',
    inject([UtilService], (service: UtilService) => {
      const filters = { board: ['CBSE'] };
      const softConstraintFilter = { board: ['NCERT'], channel: 'b00bc992ef25f1a9a8d63291e20efc8d' };
      const softconstraints = { badgeAssertions: 98, board: 99, channel: 100 };
      const expectedSoftconstraintsvalue = {
        filters: { board: ['CBSE'], channel: 'b00bc992ef25f1a9a8d63291e20efc8d' },
        softConstraints: { badgeAssertions: 98, channel: 100 }
      };
      const softconstraintsdata = service.manipulateSoftConstraint(filters, softConstraintFilter, softconstraints);
      expect(service.manipulateSoftConstraint).toBeDefined();
      expect(softconstraintsdata).toEqual(expectedSoftconstraintsvalue);
    }));

  it('should call manipulateSoftConstraint when filters are not present',
    inject([UtilService], (service: UtilService) => {
      const filters = {};
      const softConstraintFilter = { board: ['NCERT'], channel: 'b00bc992ef25f1a9a8d63291e20efc8d' };
      const softconstraints = { badgeAssertions: 98, board: 99, channel: 100 };
      const expectedSoftconstraintsvalue = {
        filters: { board: ['NCERT'], channel: 'b00bc992ef25f1a9a8d63291e20efc8d' },
        softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }
      };
      const softconstraintsdata = service.manipulateSoftConstraint(filters, softConstraintFilter, softconstraints);
      expect(service.manipulateSoftConstraint).toBeDefined();
      expect(softconstraintsdata).toEqual(expectedSoftconstraintsvalue);
    }));
});
