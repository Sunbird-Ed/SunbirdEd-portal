import { CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentPlayerMetadataComponent } from './content-player-metadata.component';
import {mockRes} from './contnet-player-metadata.spec.data';
describe('ContentMetadataComponent', () => {
  let component: ContentPlayerMetadataComponent;
  let fixture: ComponentFixture<ContentPlayerMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule.forRoot()],
      declarations: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlayerMetadataComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.conceptDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.conceptDataSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should Take INPUT for content MetaData and show Attribution field  ', () => {
    component.contentData = mockRes.contentData;
    component.ngOnInit();
    expect(component.metadata.attributions).toEqual('Text Attribution');
  });
});
