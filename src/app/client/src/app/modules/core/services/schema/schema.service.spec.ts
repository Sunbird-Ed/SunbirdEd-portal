import { FormService } from '../form/form.service';
import { of } from 'rxjs';
import { SchemaService } from './schema.service';
import { response} from './schema.service.spec.data';

describe('SchemaService', () => {
  let schemaService: SchemaService;
  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn().mockImplementation(() => of({
      response
    }))
  };
  beforeAll(() => {
    schemaService = new SchemaService(
        mockFormService  as FormService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of schemaService', () => {
    expect(schemaService).toBeTruthy();
  });
  describe('fetchSchemas', () => {
    it('should call fetch Schemas method with the config and respond with the result ', () => {
      const config = { formType: 'schemas', formAction: 'get', contentType: 'search' };
      const hashTagId = '*';
      mockFormService.getFormConfig = jest.fn().mockReturnValue(of({response})) as any;
      schemaService.fetchSchemas(config).subscribe((obj) => {
        expect(obj).toBe(of(response?.result?.form?.data?.fields[0]));
      });
    });
    it('should call fetch Schemas method with out the config and respond with the result ', () => {
      mockFormService.getFormConfig = jest.fn().mockReturnValue(of({response})) as any;
      schemaService.fetchSchemas().subscribe((obj) => {
        expect(obj).toBe(of(response?.result?.form?.data?.fields[0]));
      });
    });
  });

  describe('schemaValidator', () => {
    it('should call the schema Validator method with some data ', () => {
      const obj = {
        inputObj: response?.result?.form?.data?.fields[0]?.schema,
        properties: ['properties'],
        omitKeys: ['lastUpdatedOn', 'osId']
      };
      const methodResponse = schemaService.schemaValidator(obj);
      expect(JSON.stringify(methodResponse)).toBe(JSON.stringify(response?.result?.form?.data?.fields[0]?.schema));
    });
    it('should call the schema Validator method with No data ', () => {
      const methodResponse = schemaService.schemaValidator({});
      expect(JSON.stringify(methodResponse)).toBe(JSON.stringify({}));
    });
    it('should call the schema Validator method with No data and checkForScriptInjection with string value ', () => {
      const st = 'lastUpdatedOn';
      const obj = schemaService['checkForScriptInjection'](st);
      expect(obj).toBe(st);
    });
  });

  describe('getSchema', () => {
    it('should call the get schema method ', () => {
      const type = 'properties';
      schemaService['_schemas'] = response?.result?.form?.data?.fields[0]?.schema;
      const obj = schemaService.getSchema(type);
      const responseObj = ['name', 'code', 'createdOn', 'lastUpdatedOn', 'status', 'channel', 'mimeType', 'osId', 'contentEncoding', 'contentDisposition', 'mediaType', 'os'];
      expect(JSON.stringify(obj)).toBe(JSON.stringify(responseObj));
    });
  });
});
