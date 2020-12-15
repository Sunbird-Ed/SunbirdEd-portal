import { async, ComponentFixture, flush, TestBed, fakeAsync } from '@angular/core/testing';
import { NoResultComponent } from './no-result.component';
import { SharedModule } from '@sunbird/shared';
import { ResourceService } from '../../services/index';
import { of } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';

const data = {'message': 'messages.stmsg.m0007 ', 'messageText': 'messages.stmsg.m0006'};
describe('NoResultComponent', () => {
  let component: NoResultComponent;
  let fixture: ComponentFixture<NoResultComponent>;
  const resourceBundle = {
    messages : {
      imsg: { m0027: 'Something went wrong'},
      stmsg: { m0007: 'error', m0006: 'result' }
    },
    languageSelected$: of({})
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule.forRoot() ],
      providers: [ ResourceService,
      { provide: ResourceService, useValue: resourceBundle }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should take input for showing the no result message  ', fakeAsync(() => {
     component.data = data;
     component.message = data.message;
     component.messageText = data.messageText;
     component.ngOnInit();
     flush();
     expect(component.message).toBe(resourceBundle.messages.stmsg.m0007);
     expect(component.messageText).toBe(resourceBundle.messages.stmsg.m0006)
  }));
});
