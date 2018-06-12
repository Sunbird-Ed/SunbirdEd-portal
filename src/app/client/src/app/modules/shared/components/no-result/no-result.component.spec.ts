import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoResultComponent } from './no-result.component';
import { SharedModule } from '@sunbird/shared';
const data = {'message': 'no result found ', 'messageText': 'you dont have content'};
describe('NoResultComponent', () => {
  let component: NoResultComponent;
  let fixture: ComponentFixture<NoResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule.forRoot() ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultComponent);
    component = fixture.componentInstance;
  });
  it('should take input for showing the no result message  ', () => {
     component.data = data;
     component.message = data.message;
     component.messageText = data.messageText;
     component.ngOnInit();
     fixture.detectChanges();
  });
});
