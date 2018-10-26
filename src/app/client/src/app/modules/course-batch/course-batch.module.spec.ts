import { CourseBatchModule } from './course-batch.module';

describe('CourseBatchModule', () => {
  let courseBatchModule: CourseBatchModule;

  beforeEach(() => {
    courseBatchModule = new CourseBatchModule();
  });

  it('should create an instance', () => {
    expect(courseBatchModule).toBeTruthy();
  });
});
