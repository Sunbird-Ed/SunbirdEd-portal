import { InterpolatePipe } from './interpolate.pipe';

describe('InterpolatePipe', () => {
  let pipe: InterpolatePipe;

  beforeEach(() => {
    pipe = new InterpolatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should interpolate replaceText with replacedWith in the text', () => {
    const message = 'Hello, {instance}! Welcome, {userName}.';
    const instance = 'world';
    const name = 'John';

    let interpolatedMessage = pipe.transform(message, '{instance}', instance);
    interpolatedMessage = pipe.transform(interpolatedMessage, '{userName}', name);

    const expectedMessage = 'Hello, world! Welcome, John.';
    expect(interpolatedMessage).toEqual(expectedMessage);
  });

  it('should handle multiple replacements', () => {
    const message = 'This is a {first} example, {second} multiple {third} replacements.';
    const first = 'simple';
    const second = 'with';
    const third = 'text';

    let interpolatedMessage = pipe.transform(message, '{first}', first);
    interpolatedMessage = pipe.transform(interpolatedMessage, '{second}', second);
    interpolatedMessage = pipe.transform(interpolatedMessage, '{third}', third);

    const expectedMessage = 'This is a simple example, with multiple text replacements.';
    expect(interpolatedMessage).toEqual(expectedMessage);
  });

  it('should handle no replacements', () => {
    const message = 'This message has no replacements.';

    const interpolatedMessage = pipe.transform(message, '{replace}', 'with');

    expect(interpolatedMessage).toEqual(message);
  });
});
