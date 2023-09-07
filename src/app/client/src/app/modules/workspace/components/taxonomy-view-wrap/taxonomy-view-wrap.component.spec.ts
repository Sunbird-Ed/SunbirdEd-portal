import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyViewWrapComponent } from './taxonomy-view-wrap.component';

describe('TaxonomyViewWrapComponent', () => {
  let component: TaxonomyViewWrapComponent;
  let fixture: ComponentFixture<TaxonomyViewWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxonomyViewWrapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxonomyViewWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
