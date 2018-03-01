import { DateFormatPipe } from './date-format.pipe';
import * as moment from 'moment';

describe('DateFormatPipe', () => {
  describe('#transform', () => {
    it('should take default format for date', () => {
      const pipe = new DateFormatPipe();
      const date = new Date();
      const result = pipe.transform(date, '');
      const ans = moment(date).format('Do MMMM YYYY');
      expect(result).toBe(ans);
    });

    it('test for given format for date', () => {
      const pipe = new DateFormatPipe();
      const date = new Date();
      const result = pipe.transform(date, 'MMMM YYYY Do');
      const ans = moment(date).format('MMMM YYYY Do');
      expect(result).toBe(ans);
    });

    it('if date is blank', () => {
      const pipe = new DateFormatPipe();
      const result = pipe.transform('', 'Do MMMM YYYY');
      expect(result).toBe('Invalid date');
    });

  });
});
