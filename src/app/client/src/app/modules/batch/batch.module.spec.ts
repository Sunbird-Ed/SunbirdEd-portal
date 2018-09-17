import { BatchModule } from './batch.module';

describe('BatchModule', () => {
  let batchModule: BatchModule;

  beforeEach(() => {
    batchModule = new BatchModule();
  });

  it('should create an instance', () => {
    expect(batchModule).toBeTruthy();
  });
});
