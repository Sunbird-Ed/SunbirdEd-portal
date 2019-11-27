import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTextbookComponent } from './select-textbook.component';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Response } from './select-textbook.component.spec.data';

describe('TextbookSearchComponent', () => {
  let component: SelectTextbookComponent;
  let fixture: ComponentFixture<SelectTextbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTextbookComponent ],
      imports: [SuiModule, TelemetryModule.forRoot(), SharedModule.forRoot(), CoreModule, FormsModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTextbookComponent);
    component = fixture.componentInstance;
    component.selectedAttributes = Response.selectedAttributes;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
