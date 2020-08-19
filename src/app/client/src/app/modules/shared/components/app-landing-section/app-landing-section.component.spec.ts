import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { AppLandingSectionComponent } from './app-landing-section.component';
import { configureTestSuite } from '@sunbird/test-util';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe('AppLandingSectionComponent', () => {
  let component: AppLandingSectionComponent;
  let fixture: ComponentFixture<AppLandingSectionComponent>;

  const resourceBundle = {
    'messages': {
      'fmsg': {},
      'emsg': {},
      'stmsg': {}
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(),TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
         }
      }),],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLandingSectionComponent);
    component = fixture.componentInstance;
    component.noTitle = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.redoLayout();
    expect(component).toBeTruthy();
    component.redoLayout();
    expect(component).toBeTruthy();
  });
});
