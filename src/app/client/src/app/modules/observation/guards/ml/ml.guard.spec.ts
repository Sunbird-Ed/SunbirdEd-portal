import { TestBed, async, inject } from '@angular/core/testing';

import { MlGuard } from './ml.guard';

xdescribe('MlGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MlGuard]
    });
  });

  it('should ...', inject([MlGuard], (guard: MlGuard) => {
    expect(guard).toBeTruthy();
  }));
});
