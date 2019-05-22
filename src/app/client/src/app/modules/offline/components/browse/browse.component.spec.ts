import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService, BrowserCacheTtlService, ToasterService, ResourceService, SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseComponent } from './browse.component';
import { ExploreModule } from '../../../../modules/public/module/explore';



xdescribe('BrowseComponent', () => {
  let component: BrowseComponent;
  let fixture: ComponentFixture<BrowseComponent>;

  const fakeActivatedRoute = {
    snapshot: {}
  } as ActivatedRoute;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseComponent],
      imports: [ExploreModule, HttpClientTestingModule, SharedModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
