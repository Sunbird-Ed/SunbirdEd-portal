import {SbDataTablePipe} from './sb-data-table.pipe';

describe('SbDataTablePipe', () => {
  it('create an instance', () => {
    const pipe = new SbDataTablePipe();
    expect(pipe).toBeTruthy();
    const result = pipe.transform('data', null);
    expect(result).toBe('data');
  });

  it('should return empty value', () => {
    const pipe = new SbDataTablePipe();
    expect(pipe).toBeTruthy();
    const result = pipe.transform(null, null);
    expect(result).toBe('');
  });

  it('should format date', () => {
    const pipe = new SbDataTablePipe();
    expect(pipe).toBeTruthy();
    const result = pipe.transform('1599728944037', 'date');
    expect(result).toBe('28-Feb-1605 20:02');
  });

  it('should return empty as no type defined', () => {
    const pipe = new SbDataTablePipe();
    expect(pipe).toBeTruthy();
    const result = pipe.transform('1599728944037', 'dates');
    expect(result).toBe('-');
  });
});
