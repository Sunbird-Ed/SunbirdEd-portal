import { TestBed, inject } from '@angular/core/testing';
import { } from 'jasmine';
import { FlagContentService } from './flag-content.service';

describe('FlagContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlagContentService]
    });
  });

  it('should emit the data passed from a component', inject([FlagContentService], (service: FlagContentService) => {
    spyOn(service.disableFlagOnSuccess, 'emit').and.returnValue(true);
    service.updateFlag();
    expect(service.disableFlagOnSuccess.emit).toHaveBeenCalledWith(true);
  }));
});
