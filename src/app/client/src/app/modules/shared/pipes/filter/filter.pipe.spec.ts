import { FilterPipe } from './filter.pipe';
import * as testData from './filter-pipe.spec.data';
import {} from 'jasmine';

describe('FilterPipe', () => {
  describe('#transform', () => {
    it('Should take search input and provide filtered array', () => {
      const pipe = new FilterPipe();
      const searchData = 'test';
      const items = testData.mockRes.userSuccess.result.response.note;
      const result = pipe.transform(items , searchData, ['note']);
      const filteredArray = testData.mockRes.filteredArray;
      expect(result[0].note).toBe(filteredArray[0].note);
      expect(FilterPipe).toBeTruthy();
    });

    it('Should return entire array if no input provided', () => {
      const pipe = new FilterPipe();
      const searchData = '';
      const items = testData.mockRes.userSuccess.result.response.note;
      const result = pipe.transform(items , searchData, ['note']);
      const filteredArray = testData.mockRes.filteredArray;
      expect(result).toBe(items);
      expect(FilterPipe).toBeTruthy();
    });
  });
});
