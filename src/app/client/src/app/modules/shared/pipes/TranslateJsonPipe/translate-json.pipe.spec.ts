import { TranslateJsonPipe } from './translate-json.pipe';
import { TranslateService } from '@ngx-translate/core';

describe('TranslateJsonPipe', () => {
  let translateJsonPipe: TranslateJsonPipe;
  let translateService: TranslateService;

  beforeEach(() => {
    translateJsonPipe = new TranslateJsonPipe(translateService);
  });

  it('should create an instance', () => {
    expect(translateJsonPipe).toBeTruthy();
  });

  it('should return the original value if parsing fails', () => {
    const invalidJsonString = 'invalid-json-string';
    const result = translateJsonPipe.transform(invalidJsonString);
    expect(result).toEqual(invalidJsonString);
  });

  it('should return the original value if parsing fails', () => {
    const invalidJsonString = 'invalid-json-string';
    const result = translateJsonPipe.transform(invalidJsonString);
    expect(result).toEqual(invalidJsonString);
  });

  it('should return the original value if value is not a valid JSON string', () => {
    const invalidJsonString = 'invalid-json-string';
    const result = translateJsonPipe.transform(invalidJsonString);
    expect(result).toEqual(invalidJsonString);
  });

  it('should return the original value if value is null or undefined', () => {
    const resultNull = translateJsonPipe.transform(null);
    const resultUndefined = translateJsonPipe.transform(undefined);
    expect(resultNull).toEqual(null);
    expect(resultUndefined).toEqual(undefined);
  });

});
