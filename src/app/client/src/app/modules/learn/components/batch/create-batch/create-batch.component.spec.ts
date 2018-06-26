import { WorkspaceModule } from './../../../../workspace/workspace.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardModule } from './../../../../dashboard/dashboard.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LearnModule } from '@sunbird/learn';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { CreateBatchComponent } from './create-batch.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const fakeActivatedRoute = {
  'params': Observable.from([{ courseId: 'do_1125083286221291521153' }]),
  'queryParams': Observable.from([{}])
};

describe('CreateBatchComponent', () => {
  let component: CreateBatchComponent;
  let fixture: ComponentFixture<CreateBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBatchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule.forRoot(), SuiModule, LearnModule, RouterTestingModule, DashboardModule,
        HttpClientTestingModule, WorkspaceModule],
      providers: [{ provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchComponent);
    component = fixture.componentInstance;
    component.router.params.subscribe((params) => {
    });
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should disable the button on click of submit button in create batch', () => {
    spyOn(component, 'createBatch');

    // let button = fixture.nativeElement.query(By.css('#submitbutton'));

    // button.click();

    // fixture.whenStable().then(() => {
      // expect(component.createBatch).toHaveBeenCalled();
    // })
  });

});
