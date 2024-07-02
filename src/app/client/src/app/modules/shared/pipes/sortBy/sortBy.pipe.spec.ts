import { SortByPipe } from './sortBy.pipe';
import { sortData } from './sortBy.pipe.spec.data'
describe('SortByPipe', () => {
  let pipe: SortByPipe;

  beforeEach(() => {
    pipe = new SortByPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should sort subjects in ascending order', () => {
    const data = sortData.subjects;
    const sortedData = pipe.transform(data, '', 'asc');
    const expectedData = ['Accountancy', 'Business Studies', 'Physical Health and Education', 'Science', 'Training', 'ಕನ್ನಡ ಕಥೆಗಳು', 'खबरों की दीवार'];
    expectedData.sort();
    expect(sortedData).toEqual(expectedData);
  });

  it('should sort subjects in descending order', () => {
    const data = sortData.subjects;
    const sortedData = pipe.transform(data, '', 'desc');
    const expectedData = ['खबरों की दीवार', 'ಕನ್ನಡ ಕಥೆಗಳು', 'Training', 'Science', 'Physical Health and Education', 'Business Studies', 'Accountancy'];
    expectedData.sort().reverse();
    expect(sortedData).toEqual(expectedData);
  });

   it('should return the original array when input data is empty', () => {
    const data: any[] = [];
    const sortedData = pipe.transform(data, 'name', 'asc');
    expect(sortedData).toEqual([]);
  });

  it('should return the original array when sortOrder is not specified', () => {
    const data = sortData.subjects;
    const sortedData = pipe.transform(data, 'name', '');
    const expectedData = sortData.subjects;
    expect(sortedData).toEqual(expectedData);
  });

  it('should sort subject textbooks in ascending order', () => {
    const data = sortData.subjectsTextbooks;
    const sortedData = pipe.transform(data, 'name', 'asc');
    const expectedData = [
        {
          name: 'Biology',
          content: [
            {
              name: 'Textbook 1',
              description: 'Biology textbook 1',
            },
            {
              name: 'First textbook',
              description: 'Biology First textbook',
            },
            {
              name: 'Second textbook',
              description: 'Biology Second textbook',
            },
          ],
        },
        {
          name: 'English',
          content: [
            {
              name: 'Textbook 1',
              description: 'English textbook 1',
            },
            {
              name: 'First textbook',
              description: 'English First textbook',
            },
            {
              name: 'Second textbook',
              description: 'English Second textbook',
            },
          ],
        },
        {
          name: 'Science',
          content: [
            {
              name: 'Textbook 1',
              description: 'Science textbook 1',
            },
            {
              name: 'First textbook',
              description: 'Science First textbook',
            },
            {
              name: 'Second textbook',
              description: 'Science Second textbook',
            },
          ],
        },
      ];
    expect(sortedData).toEqual(expectedData);
  });

  it('should sort subject textbooks in descending order', () => {
    const data = sortData.subjectsTextbooks;
    const sortedData = pipe.transform(data, 'name', 'desc');
    const expectedData = [
         {
          name: 'Science',
          content: [
            {
              name: 'Textbook 1',
              description: 'Science textbook 1',
            },
            {
              name: 'First textbook',
              description: 'Science First textbook',
            },
            {
              name: 'Second textbook',
              description: 'Science Second textbook',
            },
          ],
        },
        {
          name: 'English',
          content: [

            {
              name: 'Textbook 1',
              description: 'English textbook 1',
            },
            {
              name: 'First textbook',
              description: 'English First textbook',
            },
            {
              name: 'Second textbook',
              description: 'English Second textbook',
            },
          ],
        },
        {
          name: 'Biology',
          content: [
            {
              name: 'Textbook 1',
              description: 'Biology textbook 1',
            },
            {
              name: 'First textbook',
              description: 'Biology First textbook',
            },
            {
              name: 'Second textbook',
              description: 'Biology Second textbook',
            },
          ],
        },
      ];
    expect(sortedData).toEqual(expectedData);
  });

});
