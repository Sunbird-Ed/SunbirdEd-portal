import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceService, SharedModule } from '@sunbird/shared';

import { SelectedFiltersComponent } from './selected-filters.component';

describe('SelectedFiltersComponent', () => {
  let component: SelectedFiltersComponent;
  let fixture: ComponentFixture<SelectedFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedFiltersComponent ],
      imports: [RouterTestingModule, SharedModule.forRoot(), HttpClientTestingModule],
      providers: [ResourceService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update route on removing a selected filter', () => {
    const router = TestBed.get(Router);
    const spy = spyOn<any>(component, 'updateRoute').and.callThrough();
    const routerSpy = spyOn(router, 'navigate');
    component.removeSelection({type: 'medium', value: 'English'});
    expect(spy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalled();
  })

});
