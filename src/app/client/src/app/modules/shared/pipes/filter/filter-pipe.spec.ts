import { FilterPipe } from './filter.pipe';
import { mockRes } from './filter-pipe.spec.data';

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter items based on searchText and searchKeys', () => {
    const data = mockRes.filteredArray;
    const searchText = 'Test test';
    const searchKeys = ['note'];
    const filteredData = pipe.transform(data, searchText, searchKeys);
    const expectedFilteredItems = data.filter(item => {
      return searchKeys.some(key => item[key].toLowerCase().includes(searchText.toLowerCase()));
    });
    expect(filteredData).toEqual(expectedFilteredItems);
  });

  it('should return the original array when searchText is empty', () => {
    const data = mockRes.filteredArray;
    const searchText = '';
    const filteredData = pipe.transform(data, searchText, ['note']);
    expect(filteredData).toEqual(data);
  })

  it('should return an empty array when items are null', () => {
    const data = null;
    const searchText = 'Test';
    const filteredData = pipe.transform(data, searchText, ['note']);
    expect(filteredData).toEqual([]);
  });

  it('should return an empty array when searchText is not found in any item', () => {
    const data = mockRes.filteredArray;
    const searchText = 'Test 123';
    const filteredData = pipe.transform(data, searchText, ['note']);
    expect(filteredData).toEqual([]);
  });

  it('should filter items based on searchText without searchKeys', () => {
    const data = mockRes.filteredArray;
    const searchText = 'Test test';
    const filteredData = pipe.transform(data, searchText, []);
    const expectedFilteredItems = data.filter(item => {
      return JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase());
    });
    expect(filteredData).toEqual(expectedFilteredItems);
  });

});
