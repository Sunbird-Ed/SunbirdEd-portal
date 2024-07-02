import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format a date to the specified format', () => {
    const date = new Date('2023-10-17T08:00:00Z');
    const format = 'YYYY-MM-DD';
    const formattedDate = pipe.transform(date, format);

    expect(formattedDate).toEqual('2023-10-17');
  });

  it('should return "-" for null or undefined date', () => {
    const format = 'YYYY-MM-DD';
    const formattedDate = pipe.transform(null, format);
    expect(formattedDate).toEqual('-');
  });

  it('should use a default format if none is provided', () => {
    const date = new Date('2023-10-17T08:00:00Z');
    const formattedDate = pipe.transform(date, '');
    expect(formattedDate).toEqual('17 October 2023');
  });
});
