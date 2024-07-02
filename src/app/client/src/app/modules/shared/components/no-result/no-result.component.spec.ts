import { ResourceService } from '../../services/index';
import * as _ from 'lodash-es';
import { NoResultComponent } from './no-result.component'

describe('NoResultComponent component should be create', () => {
  let component: NoResultComponent;
  const mockResourceService: Partial<ResourceService> = {
    instance: "SUNBIRD",
    messages: {emsg: {m0005: ""}}
  };
  beforeAll(() => {
    component = new NoResultComponent(
      mockResourceService as ResourceService
    )
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should create a instance of content type component', () => {
    expect(component).toBeTruthy();
  });
});