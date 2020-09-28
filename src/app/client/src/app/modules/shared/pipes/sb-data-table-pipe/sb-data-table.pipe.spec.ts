import {SbDataTablePipe} from './sb-data-table.pipe';

describe('SbDataTablePipe', () => {
  it('create an instance', () => {
    const pipe = new SbDataTablePipe();
    expect(pipe).toBeTruthy();
    const result = pipe.transform('data',);
    expect(result).toBe('data');
  });
});
