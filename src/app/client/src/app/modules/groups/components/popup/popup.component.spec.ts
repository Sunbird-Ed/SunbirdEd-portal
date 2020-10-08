import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupComponent } from './popup.component';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupComponent ],
      imports: [ SuiModule, SharedModule.forRoot(), HttpClientTestingModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should "emit event with name: delete " when param is delete', () => {
    spyOn(component.handleEvent, 'emit');
    spyOn(component.modal, 'close');
    component.emitEvent('delete');
    expect(component.handleEvent.emit).toHaveBeenCalledWith('delete');
    expect(component.modal.close).toHaveBeenCalled();
  });

  it ('should "emit event with name: deActivate " when param is delete', () => {
    spyOn(component.handleEvent, 'emit');
    spyOn(component.modal, 'close');
    component.emitEvent('deActivate');
    expect(component.handleEvent.emit).toHaveBeenCalledWith('deActivate');
    expect(component.modal.close).toHaveBeenCalled();
  });

  it ('should "emit event with name: activate " when param is delete', () => {
    spyOn(component.handleEvent, 'emit');
    spyOn(component.modal, 'close');
    component.emitEvent('activate');
    expect(component.handleEvent.emit).toHaveBeenCalledWith('activate');
    expect(component.modal.close).toHaveBeenCalled();
  });

  it ('should "emit empty event "', () => {
    spyOn(component.handleEvent, 'emit');
    spyOn(component.modal, 'close');
    component.emitEvent();
    expect(component.handleEvent.emit).toHaveBeenCalledWith();
    expect(component.modal.close).toHaveBeenCalled();
  });

});
