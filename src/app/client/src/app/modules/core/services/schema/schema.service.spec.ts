import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '../../core.module';
import { SchemaService } from './schema.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormService } from '../form/form.service';
import { of } from 'rxjs';

describe('SchemaService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [CoreModule, SharedModule.forRoot(), HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: SchemaService = TestBed.get(SchemaService);
    expect(service).toBeTruthy();
  });

  it('should validate against the schema', () => {
    const schemaService = TestBed.get(SchemaService);
    const input = {
      inputObj: {
        name: 'sunbird', env: 'sunbird', keyToOmit: 2, xssTestString: '<script>alert(2)</script>',
        xssTestArr: ['<script>alert(2)</script>']
      },
      properties: ['name', 'xssTestString', 'xssTestArr'],
      omitKeys: ['keyToOmit']
    };
    const result = schemaService.schemaValidator(input);
    expect(result).toEqual({ name: 'sunbird', xssTestString: '&lt;script&gt;alert(2)&lt;/script&gt;', xssTestArr: ['&lt;script&gt;alert(2)&lt;/script&gt;'] });
  });

  it('should fetch schemas', done => {
    const schemaService = TestBed.get(SchemaService);
    const formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(of([{ id: 'content', schema: { properties: ['name'] } }]));
    schemaService.fetchSchemas().subscribe(res => {
      expect(res).toBeDefined();
      const schema = schemaService.getSchema('content');
      expect(schema).toBeDefined();
      expect(schema.properties).toEqual(['name']);
      done();
    });
  });
});
