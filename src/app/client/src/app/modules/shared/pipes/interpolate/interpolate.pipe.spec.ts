import { InterpolatePipe } from './interpolate.pipe';

describe('FilterPipe', () => {
  describe('#transform', () => {
    it('Should take input and return proper data', () => {
      const pipe = new InterpolatePipe();
      const result = pipe.transform('Enter {test} key', '{test}', 'first');
      expect(result).toBe('Enter first key');
    });
  });
});
