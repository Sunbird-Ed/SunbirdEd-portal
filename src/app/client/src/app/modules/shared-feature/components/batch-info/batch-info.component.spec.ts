import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { BatchInfoComponent } from './batch-info.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';


describe('BatchInfoComponent', () => {
  let component: BatchInfoComponent;
  let fixture: ComponentFixture<BatchInfoComponent>;
  const resourceBundle = {
    'messages': {
      'emsg': {'m0005': ''}
    },
    'frmelmnts': {
      'lbl': {},
      'btn': {}
    }
  };
  class FakeActivatedRoute {
  }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
      declarations: [BatchInfoComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
        schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
