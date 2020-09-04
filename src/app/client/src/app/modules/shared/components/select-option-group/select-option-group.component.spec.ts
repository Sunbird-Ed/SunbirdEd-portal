import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectOptionGroupComponent } from './select-option-group.component';
import * as _ from 'lodash-es';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe('SelectOptionGroupComponent', () => {
  let component: SelectOptionGroupComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<SelectOptionGroupComponent>;
  const data = [{
    label: 'Publisher',
    value: 'channel',
    option: [{
      name: 'publisher_name',
      value: '012519677821'
    }]
  },
  {
    label: 'Board',
    value: 'board',
    option: [{
      name: 'board_name',
      value: 'board_name'
    }]
  }];
  const event = {label: 'Publisher', selectedOption: '012519677821', value: 'channel'};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, ReactiveFormsModule,
        TranslateModule.forRoot({
           loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
           }
        })],
      declarations: [SelectOptionGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOptionGroupComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.selectedOption = { label: 'Publisher', selectedOption: '012519677821', value: 'channel' };
    component.optionData = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call choosedValue with publisher block', () => {
    spyOn(component, 'choosedValue');
    component.choosedValue();
    expect(component.preSelectedValue).toEqual('publisher_name');
  });
  it('should call choosedValue with nonpublisher block', () => {
    component.selectedOption = { label: 'Board', selectedOption: 'board_name', value: 'channel' };
    fixture.detectChanges();
    component.ngOnInit();
    spyOn(component, 'choosedValue');
    component.choosedValue();
    expect(component.preSelectedValue).toEqual('board_name');
  });
  it('should be called for onchange ', () => {
    spyOn(component.selectedValue, 'emit');
    component.onChange(event);
    expect(component.selectedValue.emit).toHaveBeenCalledWith(event);
  });

});
