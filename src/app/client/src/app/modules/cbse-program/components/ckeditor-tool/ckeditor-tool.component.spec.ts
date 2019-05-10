import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkeditorToolComponent } from './ckeditor-tool.component';

describe('CkeditorToolComponent', () => {
  let component: CkeditorToolComponent;
  let fixture: ComponentFixture<CkeditorToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CkeditorToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkeditorToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
