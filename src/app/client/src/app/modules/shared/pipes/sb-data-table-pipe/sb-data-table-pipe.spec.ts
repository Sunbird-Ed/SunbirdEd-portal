import { SbDataTablePipe } from './sb-data-table.pipe';

describe('SbDataTablePipe', () => {
  let pipe: SbDataTablePipe;

  beforeEach(() => {
    pipe = new SbDataTablePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform value to formatted date', () => {
    const date = new Date('2023-10-23');
    const formattedDate = pipe.transform(date, 'date');
    expect(formattedDate).toEqual('23-Oct-2023');
  });

  it('should transform value to formatted date and time', () => {
    const dateTime = new Date('2023-10-23T14:30:00');
    const formattedDateTime = pipe.transform(dateTime, 'dateTime');
    expect(formattedDateTime).toEqual('23-Oct-2023 14:30');
  });

  it('should return value as is when type is not date or dateTime', () => {
    const text = 'Hello, World!';
    const transformedText = pipe.transform(text, 'otherType');
    expect(transformedText).toEqual('-');
  });

  it('should return an empty string when value is falsy', () => {
    const emptyValue = null;
    const transformedValue = pipe.transform(emptyValue, 'date');
    expect(transformedValue).toEqual('');
  });
});
