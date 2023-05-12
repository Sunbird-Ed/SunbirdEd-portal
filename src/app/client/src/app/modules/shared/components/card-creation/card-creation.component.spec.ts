import { CardCreationComponent } from '..';
import { ResourceService } from '../../services/index';

describe('CardCreationComponent', ()=> {
  let cardCreationComponent:CardCreationComponent;
  const mockResourceService:Partial<ResourceService>={};

  beforeAll(() => {
    cardCreationComponent = new CardCreationComponent(
      mockResourceService as ResourceService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should  create an instance of cardCreationComponent", () => {
    expect(cardCreationComponent).toBeTruthy();
  });

  describe('ngOnInit', ()=>{
    it('should set telemetryInteractObject and telemetryInteractEdata', ()=>{
      cardCreationComponent.data={
        metaData:{
          identifier:'user1',
          contentType:'data'
        },
        telemetryObjectType:'1'
      } as any;
      const interactObjectData={
        id: 'user1',
        type: 'data',
        ver: '1.0'
      };
      const interactEData={
        id: 'delete',
        type: 'click',
        pageid: '1'
      };
      cardCreationComponent.ngOnInit();
      expect(cardCreationComponent.telemetryInteractObject).toBeDefined();
      expect(cardCreationComponent.telemetryInteractEdata).toBeDefined();
      expect(cardCreationComponent.telemetryInteractObject).toEqual(interactObjectData);
      expect(cardCreationComponent.telemetryInteractEdata).toEqual(interactEData);
    });
  });

  it('should emit data by clickEvent event emitter', ()=> {
    cardCreationComponent.clickEvent={
        emit:jest.fn()
    } as any;
    const argData={
        action:'click',
        data:'data'
    };
    jest.spyOn(cardCreationComponent.clickEvent,'emit');
    cardCreationComponent.onAction('data','click');
    expect(cardCreationComponent.clickEvent.emit).toBeCalledWith(argData);
  })
})