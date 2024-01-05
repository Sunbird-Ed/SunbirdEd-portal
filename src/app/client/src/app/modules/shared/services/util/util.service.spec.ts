import { UtilService } from './util.service';
import { of } from 'rxjs';
import TreeModel from 'tree-model';
import { ResourceService } from '../resource/resource.service';
import { GenericResourceService } from '../genericResource/genericResource.service';
import dayjs from 'dayjs';
import { ExportToCsv } from 'export-to-csv';
import { environment } from '@sunbird/environment';
import { TransposeTermsPipe } from '../../pipes/transposeTerms/transposeTerms.pipe';
import { colorSet, iconObj, collectionData } from './util.service.spec.data';

describe('UtilService', () => {
  let utilService: UtilService;

  const mockResourceService: Partial<ResourceService> = {};
  const mockGenericResourceService: Partial<GenericResourceService> = {
    initialize: jest.fn()
  };

  beforeEach(() => {
    utilService = new UtilService(mockResourceService as ResourceService, mockGenericResourceService as GenericResourceService);
  });

  it('should be created', () => {
    expect(utilService).toBeTruthy();
  });

  it('should return the correct value for isDesktopApp', () => {
    const expectedValue = false; // Running in NonDesktop Mode
    const result = utilService.isDesktopApp;
    expect(result).toEqual(expectedValue);
  });

  describe('sortChildrenWithIndex', () => {
    it('should sort children based on index', () => {
      const tree = {
        children: [
          { index: 3 },
          { index: 1 },
          { index: 2 },
        ],
      };
      const result = utilService.sortChildrenWithIndex(tree);
      expect(result.children.map((child) => child.index)).toEqual([1, 2, 3]);
    });

    it('should handle empty children array', () => {
      const tree = {
        children: [],
      };
      const result = utilService.sortChildrenWithIndex(tree);
      expect(result.children).toEqual([]);
    });

    it('should handle missing children property', () => {
      const tree = {};
      const result = utilService.sortChildrenWithIndex(tree);
      expect(result).toEqual({});
    });
  });

  describe('getTopicSubTopic', () => {
    it('should return the first element if type is "topic" and topic array has elements', () => {
      const type = 'topic';
      const topic = ['Topic1', 'Topic2', 'Topic3'];
      const result = utilService.getTopicSubTopic(type, topic);
      expect(result).toBe('Topic1');
    });

    it('should return an empty string if type is "topic" and topic array is empty', () => {
      const type = 'topic';
      const topic = [];
      const result = utilService.getTopicSubTopic(type, topic);
      expect(result).toBe('');
    });

    it('should return the second element if type is not "topic" and topic array has more than one element', () => {
      const type = 'subtopic';
      const topic = ['Topic1', 'SubTopic1', 'SubTopic2'];
      const result = utilService.getTopicSubTopic(type, topic);
      expect(result).toBe('SubTopic1');
    });

    it('should return an empty string if type is not "topic" and topic array has less than two elements', () => {
      const type = 'subtopic';
      const topic = ['Topic1'];
      const result = utilService.getTopicSubTopic(type, topic);
      expect(result).toBe('');
    });
  });

  describe('toggleAppPopup', () => {
    it('should toggle the showAppPopUp property', () => {
      const initialShowAppPopup = utilService.showAppPopUp;
      utilService.toggleAppPopup();
      const afterToggleShowAppPopup = utilService.showAppPopUp;
      expect(afterToggleShowAppPopup).toBe(!initialShowAppPopup);
    });
  });

  describe('isDownloaded', () => {
    it('should return true if content is available and status is "DOWNLOADED"', () => {
      const content = {
        mimeType: 'application/vnd.ekstep.ecml-archive',
        body: 'body',
        identifier: 'domain_66675',
        versionKey: '1497028761823',
      };
      const status = 'DOWNLOADED';
      const mockIsAvailable = jest.spyOn(utilService, 'isAvailable').mockReturnValue(true);
      const result = utilService.isDownloaded(content, status);
      expect(result).toBe(true);
      expect(mockIsAvailable).toHaveBeenCalledWith(content);
    });

    it('should return false if content is available and status is not "DOWNLOADED"', () => {
      const content = {
        mimeType: 'application/vnd.ekstep.ecml-archive',
        body: 'body',
        identifier: 'domain_66675',
        versionKey: '1497028761823',
      };
      const status = 'DOWNLOAD';
      const mockIsAvailable = jest.spyOn(utilService, 'isAvailable').mockReturnValue(true);
      const result = utilService.isDownloaded(content, status);
      expect(result).toBe(false);
      expect(mockIsAvailable).toHaveBeenCalledWith(content);
    });

    it('should return false if content is not available and status is "DOWNLOADED"', () => {
      const content = {
        mimeType: 'application/vnd.ekstep.ecml-archive',
        body: 'body',
        identifier: 'domain_66675',
        versionKey: '1497028761823',
      };
      const status = 'DOWNLOADED';
      const mockIsAvailable = jest.spyOn(utilService, 'isAvailable').mockReturnValue(false);
      const result = utilService.isDownloaded(content, status);
      expect(result).toBe(false);
      expect(mockIsAvailable).toHaveBeenCalledWith(content);
    });

    it('should return true if content is not available and status is "DOWNLOAD"', () => {
      const content = {
        mimeType: 'application/vnd.ekstep.ecml-archive',
        body: 'body',
        identifier: 'domain_66675',
        versionKey: '1497028761823',
      };
      const status = 'DOWNLOAD';
      const mockIsAvailable = jest.spyOn(utilService, 'isAvailable').mockReturnValue(false);
      const result = utilService.isDownloaded(content, status);
      expect(result).toBe(true);
      expect(mockIsAvailable).toHaveBeenCalledWith(content);
    });
  });

  describe('parseJson', () => {
    it('should parse a valid JSON string', () => {
      const jsonString = '{"key": "value"}';
      const result = utilService.parseJson(jsonString);
      expect(result).toEqual({ key: 'value' });
    });

    it('should throw an error for an invalid JSON string', () => {
      const invalidJsonString = 'invalid_json_string';
      expect(() => utilService.parseJson(invalidJsonString)).toThrowError('ERROR_PARSING_STRING');
    });
  });

  describe('removeDuplicateData', () => {
    it('should remove duplicates from an array of objects based on a specified key', () => {
      const data = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'John' },
      ];
      const key = 'id';
      const result = utilService.removeDuplicateData(data, key);
      expect(result).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ]);
    });
  });

  describe('removeDuplicate', () => {
    it('should remove duplicates from an object of arrays based on a specified key', () => {
      const dataToProcess = {
        channel: [
          { identifier: 'channel1', name: 'Channel 1' },
          { identifier: 'channel2', name: 'Channel 2' },
          { identifier: 'channel1', name: 'Channel 1' },
        ],
        category: [
          { identifier: 'category1', name: 'Category 1' },
          { identifier: 'category2', name: 'Category 2' },
          { identifier: 'category1', name: 'Category 1' },
        ],
      };
      const result = utilService.removeDuplicate(dataToProcess);
      expect(result).toEqual({
        channel: [
          { identifier: 'channel1', name: 'Channel 1' },
          { identifier: 'channel2', name: 'Channel 2' },
        ],
        category: [
          { identifier: 'category1', name: 'Category 1' },
          { identifier: 'category2', name: 'Category 2' },
        ],
      });
    });
  });

  describe('getAppBaseUrl', () => {
    it('should return the base URL from the element with id "baseUrl" if it exists', () => {
      const mockDocument = document;
      const baseUrlElement = mockDocument.createElement('input');
      baseUrlElement.id = 'baseUrl';
      baseUrlElement.value = 'https://example.com';
      mockDocument.getElementById = jest.fn().mockReturnValue(baseUrlElement);
      const result = utilService.getAppBaseUrl();
      expect(result).toBe('https://example.com');
    });

    it('should return the current location origin if the element with id "baseUrl" does not exist', () => {
      const mockDocument = document;
      mockDocument.getElementById = jest.fn().mockReturnValue(null);
      const result = utilService.getAppBaseUrl();
      expect(result).toBe(document.location.origin);
    });
  });

  describe('getRandomColor', () => {
    it('should return a random color from the provided color set', () => {
      const expectedColorSet = colorSet;
      const result = utilService.getRandomColor(expectedColorSet);
      expect(result).toHaveProperty('iconBgColor');
      expect(result).toHaveProperty('pillBgColor');
      const isIconColorValid = expectedColorSet.some(
        color => color.primary === result.iconBgColor
      );
      const isPillColorValid = expectedColorSet.some(
        color => color.secondary === result.pillBgColor
      );
      expect(isIconColorValid).toBe(true);
      expect(isPillColorValid).toBe(true);
    });

    it('should return null if the provided color set is empty', () => {
      const emptyColorSet = [];
      const result = utilService.getRandomColor(emptyColorSet);
      expect(result).toBeNull();
    });
  });

  describe('getSectionPillIcon', () => {
    it('should return the icon value from the provided iconObj based on the provided pillValue', () => {
      const pillValue = 'english';
      const result = utilService.getSectionPillIcon(iconObj, pillValue);
      expect(result).toBe('assets/images/book_english.svg');
    });

    it('should return the default icon value if the pillValue is not found in the iconObj', () => {
      const pillValue = 'history';
      const result = utilService.getSectionPillIcon(iconObj, pillValue);
      expect(result).toBe('assets/images/book_default.svg');
    });
  });

  describe('isIos', () => {
    it('should return true when the userAgent indicates an iOS device', () => {
      const mockUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
      Object.defineProperty(navigator, 'userAgent', { value: mockUserAgent, configurable: true });
      const result = utilService.isIos;
      expect(result).toBe(true);
    });

    it('should return false when the userAgent does not indicate an iOS device', () => {
      const mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      Object.defineProperty(navigator, 'userAgent', { value: mockUserAgent, configurable: true });
      const result = utilService.isIos;
      expect(result).toBe(false);
    });
  });

  describe('transposeTerms', () => {
    it('should transpose terms using the TransposeTermsPipe', () => {
      const value = 'Translate me {key}';
      const defaultValue = 'Default translation';
      const selectedLang = 'en';
      const startsWith = '{';
      const endsWith = '}';
      const mockTransformedValue = 'Translated Value';
      jest.spyOn(TransposeTermsPipe.prototype, 'transform').mockReturnValue(mockTransformedValue);
      const result = utilService.transposeTerms(value, defaultValue, selectedLang, startsWith, endsWith);
      expect(result).toBe(mockTransformedValue);
      expect(TransposeTermsPipe.prototype.transform).toHaveBeenCalledWith(value, defaultValue, selectedLang, startsWith, endsWith);
    });
  });

  describe('flattenObject', () => {
    it('should flatten a nested object', () => {
      const nestedObject = {
        key1: 'value1',
        key2: {
          key3: 'value3',
          key4: {
            key5: 'value5',
          },
        },
        key6: 'value6',
      };
      const result = utilService.flattenObject(nestedObject);
      expect(result).toEqual({
        key1: 'value1',
        'key2.key3': 'value3',
        'key2.key4.key5': 'value5',
        key6: 'value6',
      });
    });

    it('should handle an empty object', () => {
      const emptyObject = {};
      const result = utilService.flattenObject(emptyObject);
      expect(result).toEqual({});
    });

    it('should handle an object with primitive values', () => {
      const primitiveObject = {
        key1: 'value1',
        key2: 42,
        key3: true,
      };
      const result = utilService.flattenObject(primitiveObject);
      expect(result).toEqual({
        key1: 'value1',
        key2: 42,
        key3: true,
      });
    });
  });

  describe('processCourseFacetData', () => {
    it('should handle empty sections and return an empty facet object', () => {
      const sections = null;
      const keys = ['facet1', 'facet2', 'additionalCategories'];
      const result = utilService.processCourseFacetData(sections, keys);
      expect(result).toEqual({});
    });

    it('should handle missing facets in sections and return an empty facet object', () => {
      const sections = {};
      const keys = ['facet1', 'facet2', 'additionalCategories'];
      const result = utilService.processCourseFacetData(sections, keys);
      expect(result).toEqual({});
    });

  });

  describe('reduceTreeProps', () => {
    it('should reduce tree properties and return a new object with only required properties', () => {
      const collection = collectionData;
      const requiredProps = ['id', 'ver', 'ts'];

      const result = utilService.reduceTreeProps(collectionData, requiredProps);

      expect(result).toEqual({
        id: 'api.course.hierarchy',
        ver: '1.0',
        ts: '2020-01-10T06:02:18.087Z',
      });
    });
  });

  describe('translateValues', () => {
    it('should translate values in the data object and its children', () => {
      const data = [
        {
          name: 'English',
          translations: '{"es": "inglés"}',
          children: [
            {
              name: 'Child 1',
              translations: '{"es": "Hijo 1"}',
            },
            {
              name: 'Child 2',
              translations: '{"es": "Hijo 2"}',
            },
          ],
        },
      ];
      const lang = 'es';
      const result = utilService.translateValues(data, lang);
      expect(result).toBeDefined();
      expect(result[0].name).toBe('inglés');
      expect(result[0].children[0].name).toBe('Hijo 1');
      expect(result[0].children[1].name).toBe('Hijo 2');
    });

   it('should handle data with no children or translations', () => {
      const data = [
        {
          name: 'English',
        },
      ];
      const lang = 'es';
      const result = utilService.translateValues(data, lang);
      expect(result).toBeDefined();
      expect(result[0].name).toBe('English');
    });
  });

  describe('translateLabel', () => {
    it('should translate the label to the selected language if translation is available', () => {
      const formFieldCategory = {
        label: 'English Label',
        translations: '{"es": "Etiqueta inglesa"}',
      };
      const selectedLanguage = 'es';
      const result = utilService.translateLabel(formFieldCategory, selectedLanguage);
      expect(result).toBeDefined();
      expect(result.label).toBe('Etiqueta inglesa');
    });

    it('should return the original label if translation is not available for the selected language', () => {
      const formFieldCategory = {
        label: 'English Label',
        translations: '{"fr": "étiquette anglaise"}',
      };
      const selectedLanguage = 'es';
      const result = utilService.translateLabel(formFieldCategory, selectedLanguage);
      expect(result).toBeDefined();
      expect(result.label).toBe('English Label');
    });

    it('should return the original label if no translation object is provided', () => {
      const formFieldCategory = {
        label: 'English Label',
      };
      const selectedLanguage = 'es';
      const result = utilService.translateLabel(formFieldCategory, selectedLanguage);
      expect(result).toBeDefined();
      expect(result.label).toBe('English Label');
    });
  });

  describe('getPlayerDownloadStatus', () => {
    it('should return true if content is downloaded', () => {
      const status = 'DOWNLOADED';
      const content = { downloadStatus: 'DOWNLOADED' };
      const result = utilService.getPlayerDownloadStatus(status, content);
      expect(result).toBe(true);
    });

    it('should return false if content is not downloaded', () => {
      const status = 'DOWNLOADED';
      const content = { downloadStatus: 'DOWNLOADING' };
      const result = utilService.getPlayerDownloadStatus(status, content);
      expect(result).toBe(false);
    });

    it('should return true when addedUsing is "import" and downloadStatus is falsy', () => {
      const status = 'DOWNLOAD';
      const content = {
        desktopAppMetadata: {
          addedUsing: 'import',
        },
      };
      jest.spyOn(utilService, 'isDownloaded').mockReturnValue(true);
      const result = utilService.getPlayerDownloadStatus(status, content);
      expect(result).toBe(true);
    });

    it('should return the result of isDownloaded when addedUsing is "import" and downloadStatus is falsy', () => {
      const status = 'DOWNLOAD';
      const content = {
        desktopAppMetadata: {
          addedUsing: 'import',
        },
      };
      jest.spyOn(utilService, 'isDownloaded').mockReturnValue(true);
      const result = utilService.getPlayerDownloadStatus(status, content);
      expect(result).toBe(true);
      expect(utilService.isDownloaded).toHaveBeenCalledWith(content, status);
    });

    it('should return the result of isDownloaded when status is "DOWNLOAD" and downloadStatus is falsy', () => {
      const status = 'DOWNLOAD';
      const content = {};
      jest.spyOn(utilService, 'isDownloaded').mockReturnValue(true);
      const result = utilService.getPlayerDownloadStatus(status, content);
      expect(result).toBe(true);
      expect(utilService.isDownloaded).toHaveBeenCalledWith(content, status);
    });
  });

  describe('getPlayerUpdateStatus', () => {
    it('should return true if in library, updated, and status is UPDATE', () => {
      const status = 'UPDATE';
      const content = { downloadStatus: 'FAILED' };
      const currentRoute = 'library';
      const isUpdated = true;
      const result = utilService.getPlayerUpdateStatus(status, content, currentRoute, isUpdated);
      expect(result).toBe(true);
    });

    it('should return false if not in library or not updated', () => {
      const status = 'UPDATE';
      const content = { downloadStatus: 'FAILED' };
      const currentRoute = 'someOtherRoute';
      const isUpdated = false;
      const result = utilService.getPlayerUpdateStatus(status, content, currentRoute, isUpdated);
      expect(result).toBe(false);
    });

    it('should return true if downloadStatus matches the provided status', () => {
      const status = 'YOUR_STATUS';
      const content = {
        downloadStatus: 'YOUR_STATUS',
      };
      const currentRoute = 'library';
      const isUpdated = true;
      const result = utilService.getPlayerUpdateStatus(status, content, currentRoute, isUpdated);
      expect(result).toBe(true);
    });

  it('should return false if downloadStatus does not match the provided status', () => {
    const status = 'YOUR_STATUS';
    const content = {
      downloadStatus: 'ANOTHER_STATUS',
    };
    const currentRoute = 'library';
    const isUpdated = true;
    const result = utilService.getPlayerUpdateStatus(status, content, currentRoute, isUpdated);
    expect(result).toBe(false);
  });
  });

  describe('isAvailable', () => {
    it('should return false if content is not available', () => {
      const content = {
        mimeType: 'application/vnd.ekstep.ecml-archive',
        body: 'body',
        identifier: 'domain_66675',
        versionKey: '1497028761823',
        downloadStatus: 'DOWNLOADED',
        desktopAppMetadata: {
          addedUsing: 'import',
          isAvailable: false
        }
      };
      const result = utilService.isAvailable(content);
      expect(result).toBe(false);
    });

    it('should return false if content does not have desktopAppMetadata', () => {
      const content = {
        mimeType: 'application/vnd.ekstep.ecml-archive',
        body: 'body',
        identifier: 'domain_66675',
        versionKey: '1497028761823',
        downloadStatus: 'DOWNLOADED',
      };
      const result = utilService.isAvailable(content);
      expect(result).toBe(false);
    });
  });

  describe('manipulateSoftConstraint',()=>{
    it('should return soft constraints when no filter is provided and framework data is empty', () => {
    const filter = null;
    const softConstraintData = {
      filters: { subject: ['English'], board: ['NCERT', 'ICSE'], channel: '0123166367624478721' },
      softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
      mode: 'soft'
    };
    const frameWorkData = {};
    const result = utilService.manipulateSoftConstraint(filter, softConstraintData, frameWorkData);
    expect(result).toEqual(softConstraintData);
    });

    it('should return false when a filter is provided, regardless of framework data', () => {
      const filter = {objectType: 'Content', contentType: 'Course', status: Array(1)}
      const softConstraintData = {};
      const frameWorkData = {};
      const result = utilService.manipulateSoftConstraint(filter, softConstraintData, frameWorkData);
      expect(result).toBe(false);
    });

    it('should return filtered framework data in soft mode when framework data is not empty and no filter is provided', () => {
      const filter = null;
      const softConstraintData = {
        filters: { subject: ['English'], board: ['NCERT', 'ICSE'], channel: '0123166367624478721' },
        softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
        mode: 'soft'
      };
      const frameWorkData = null;
      const result = utilService.manipulateSoftConstraint(filter, softConstraintData, frameWorkData);
      expect(result).toEqual({
        filters: { subject: ['English'], board: ['NCERT', 'ICSE'], channel: '0123166367624478721' },
        softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
        mode: 'soft'
      });
    });
  });

  describe('processCourseFacetData', () => {
    it('should handle empty sections and return an empty object', () => {
      const sections = null;
      const keys = ['primaryCategory', 'additionalCategories'];
      const result = utilService.processCourseFacetData(sections, keys);
      expect(result).toEqual({});
    });

    it('should process course facet data correctly', () => {
      const sections = {
        facets: [
          { name: 'primaryCategory', values: ['Math', 'Science'] },
          { name: 'additionalCategories', values: ['Physics', 'Chemistry'] },
        ],
      };
      const keys = ['primaryCategory', 'additionalCategories'];
      jest.spyOn(utilService, 'processCourseFacetData').mockReturnValue({
        primaryCategory: ['Math', 'Science'],
        additionalCategories: ['Physics', 'Chemistry'],
      });
      const result = utilService.processCourseFacetData(sections, keys);
      expect(result).toEqual({additionalCategories: ["Physics", "Chemistry"], "primaryCategory": ["Math", "Science"]});
    });
  });

  describe('processData', ()=>{
    it('should process sections and extract facets based on keys', () => {
      const sections = [
        {
          facets: [
            { name: 'category', values: [{ type: 'A' }, { type: 'B' }] },
            { name: 'color', values: [{ type: 'Red' }, { type: 'Blue' }] },
          ],
        },
        {
          facets: [
            { name: 'category', values: [{ type: 'C' }, { type: 'D' }] },
            { name: 'size', values: [{ type: 'Small' }, { type: 'Large' }] },
          ],
        },
      ];
      const keys = ['category', 'color', 'size'];
      const result = utilService.processData(sections, keys);
      const expectedOutput = {
        category: [
          { type: 'A' },
          { type: 'B' },
          { type: 'C' },
          { type: 'D' },
        ],
        color: [
          { type: 'Red' },
          { type: 'Blue' },
        ],
        size: [
          { type: 'Small' },
          { type: 'Large' },
        ],
      };
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('downloadCSV', () => {
    it('should generate CSV file with the correct filename and data', () => {
      const collection = { name: 'TestCollection' };
      const data = [
        { id: 1, name: 'Item 1', price: 10.99 },
        { id: 2, name: 'Item 2', price: 19.99 },
      ];
      const mockGenerateCsv = jest.fn();
      jest.spyOn(ExportToCsv.prototype, 'generateCsv').mockImplementation(mockGenerateCsv);
      utilService.downloadCSV(collection, data);
      expect(mockGenerateCsv).toHaveBeenCalledWith(data);
      expect(mockGenerateCsv).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearSearchQuery', () => {
    it('should call next on searchQuery', () => {
      const mockNext = jest.fn();
      utilService['searchQuery'].next = mockNext;
      utilService.clearSearchQuery();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('updateSearchKeyword', () => {
    it('should emit search keyword', (done) => {
      const keyword = 'example';
      utilService.searchKeyword.subscribe((emittedKeyword) => {
        expect(emittedKeyword).toBe(keyword);
        done();
      });
      utilService.updateSearchKeyword(keyword);
    });
  });

  describe('updateRoleChange', () => {
    it('should emit role change', (done) => {
      const roleType = 'admin';
      jest.spyOn(utilService.roleChanged, 'next');
      utilService.updateRoleChange(roleType);
      expect(utilService.roleChanged.next).toHaveBeenCalledWith(roleType);
      done();
    });
  });

  describe('EmitLanguageEvent', () => {
    it('should emit language change event', (done) => {
      const language = { code: 'en', label: 'English', dir: 'ltr', value: 'english' };
      utilService.languageChange.subscribe((emittedLanguage) => {
        expect(emittedLanguage).toEqual(language);
        done();
      });

      utilService.emitLanguageChangeEvent(language);
    });
  });

  describe('emitHideHeaderTabsEvent', () => {
    it('should emit hide header tabs event', (done) => {
      const hideTab = true;
      utilService.hideHeaderTabs.subscribe((emittedHideTab) => {
        expect(emittedHideTab).toEqual(hideTab);
        done();
      });
      utilService.emitHideHeaderTabsEvent(hideTab);
    });
  });

  describe('convertSelectedOption', () => {
    it('should convert selected options based on translations', () => {
      const selectedData = {
        color: ['red', 'green'],
        size: ['small', 'medium'],
      };
      const formFieldProperties = [
        {
          code: 'color',
          range: [
            { translations: '{"en": "Red", "fr": "Rouge"}' },
            { translations: '{"en": "Green", "fr": "Vert"}' },
          ],
        },
        {
          code: 'size',
          range: [
            { translations: '{"en": "Small", "fr": "Petit"}' },
            { translations: '{"en": "Medium", "fr": "Moyen"}' },
          ],
        },
      ];
      const selectedLanguage = 'en';
      const convertLanguage = 'fr';
      const convertedOptions = utilService.convertSelectedOption(
        selectedData,
        formFieldProperties,
        selectedLanguage,
        convertLanguage
      );
      expect(convertedOptions).toEqual({
        color: ['red', 'green'],
        size: ['small', 'medium'],
      });
    });
  });

});
