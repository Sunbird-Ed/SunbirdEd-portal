import { SortByPipe } from './sortBy.pipe';
import { sortData } from './sortBy.pipe.spec.data';

describe('SortByPipe', () => {
  let sortPipe: SortByPipe;

  beforeEach(() => {
    sortPipe = new SortByPipe();
  });

  it('should create an instance', () => {
    expect(sortPipe).toBeTruthy();
  });

  it('should return sorted array in ascending order', () => {
    const sortedValue = sortPipe.transform(sortData.subjects, '', 'asc');
    expect(sortedValue[0]).toEqual('Accountancy' as string);
  });

  it('should return sorted array in descending order', () => {
    const sortedValue = sortPipe.transform(sortData.subjects, '', 'desc');
    expect(sortedValue[0]).toEqual('ಕನ್ನಡ ಕಥೆಗಳು'.trim() as string);
  });

  it('should return sorted array of objects in ascending order based on key specified', () => {
    const sortedValue = sortPipe.transform(sortData.subjectsTextbooks, 'name', 'asc');
    expect(sortedValue[0].name).toEqual('Biology' as string);
  });

  it('should return sorted array of objects in descending order based on key specified', () => {
    const sortedValue = sortPipe.transform(sortData.subjectsTextbooks, 'name', 'desc');
    expect(sortedValue[0].name).toEqual('Science' as string);
  });

  it('should return sorted array of objects in descending order based on key specified', () => {
    const sortedValue = sortPipe.transform([], '', 'asc');
    expect(sortedValue).toEqual([] as any);
  });

});
