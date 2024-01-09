import { CdnprefixPipe } from './cdnprefix.pipe';

describe('CdnprefixPipe', () => {
  let pipe: CdnprefixPipe;

  beforeEach(() => {
    pipe = new CdnprefixPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform with cdnBaseUrl for assets/', () => {
    const cdnBaseUrl = 'https://cdn.example.com/';
    const value = 'assets/image.jpg';
    const expectedTransformedValue = cdnBaseUrl + value;
    pipe.cdnBaseUrl = cdnBaseUrl;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toEqual(expectedTransformedValue);
  });

  it('should return the value unchanged if it does not start with assets/', () => {
    const cdnBaseUrl = 'https://cdn.example.com/';
    const value = 'other/image.jpg';

    pipe.cdnBaseUrl = cdnBaseUrl;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toEqual(value);
  });

  it('should return the value unchanged if cdnBaseUrl is not provided', () => {
    const value = 'assets/image.jpg';
    pipe.cdnBaseUrl = '';
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toEqual(value);
  });
});
