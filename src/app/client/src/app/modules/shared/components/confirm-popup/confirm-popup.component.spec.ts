import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';


import { ConfirmPopupComponent } from './confirm-popup.component';

describe('ConfirmPopupComponent', () => {
  let component: ConfirmPopupComponent;
  let fixture: ComponentFixture<ConfirmPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmPopupComponent],
      imports: [SuiModule, HttpClientTestingModule],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true when clicked on yes', () => {
    spyOn(component.confirmation, 'emit');
    component.confirm(true);
    expect(component.confirmation.emit).toHaveBeenCalled();
    expect(component.confirmation.emit).toHaveBeenCalledWith(true);
  });

  it('should emit false when clicked on No', () => {
    spyOn(component.confirmation, 'emit');
    component.confirm(false);
    expect(component.confirmation.emit).toHaveBeenCalled();
    expect(component.confirmation.emit).toHaveBeenCalledWith(false);
  });

  it('should run closeModal()', async () => {
    component.modal = { deny() { } };
    spyOn(component.modal, 'deny');
    component['closeModal']();
    expect(component.modal.deny).toHaveBeenCalled();
  });
});
