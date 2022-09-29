import { ResourceService } from '@sunbird/shared';
import { SubmissionsComponent } from './submission.component';

describe('Submission component', ()=>{
  let submissionComponent:SubmissionsComponent;
  const mockResourceService:Partial<ResourceService>={
    frmelmnts:{
      lbl:{
        edit:'edit',
        delete:'delete'
      }
    }
  };
  const actions = [{
    name: 'edit',
    icon: 'pencil alternate large icon',
    type: 'edit'
    },
    {
    name: 'delete',
    icon: 'trash  large icon',
    type: 'delete'
  }];

  beforeAll(() => {
    submissionComponent = new SubmissionsComponent(
      mockResourceService as ResourceService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should  create an instance of submissionComponent and set actions property", () => {
    expect(submissionComponent).toBeTruthy();
    expect(submissionComponent.actions).toEqual(actions);
  });

  it("should  handle open method", () => {
    const data={
      submissionNumber:null
    };
    const sbnum=123;
    submissionComponent.selectedSubmission={
      emit:jest.fn()
    } as any;
    jest.spyOn(submissionComponent.selectedSubmission,'emit');
    submissionComponent.open(sbnum,data);
    expect(data.submissionNumber).toEqual(123);
    expect(submissionComponent.selectedSubmission.emit).toBeCalledWith(data);
  });

  it("should  handle actionEvent method", () => {
    submissionComponent.submission={
     _id:1
    };
    const type='click';
    const data={
      value:'data'
    };
    submissionComponent.onAction={
      emit:jest.fn()
    } as any;
    const argData={
      action:'click',
      data:{
        value:'data',
        submissionId:1
      }
    };
    jest.spyOn(submissionComponent.onAction,'emit');
    submissionComponent.actionEvent(data,type);
    expect(submissionComponent.onAction.emit).toBeCalledWith(argData);
  });
})