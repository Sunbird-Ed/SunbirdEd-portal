import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentImportComponent } from './content-import.component';
import { OfflineFileUploaderService } from '../../services';


describe('ContentImportComponent', () => {
  let component: ContentImportComponent;
  let fixture: ComponentFixture<ContentImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentImportComponent],
      providers: [ OfflineFileUploaderService ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call ngoninit', () => {
    const offlineFileUploaderService = TestBed.get(OfflineFileUploaderService);
    spyOn(offlineFileUploaderService, 'initilizeFileUploader');
    component.ngOnInit();
    expect(offlineFileUploaderService.initilizeFileUploader).toHaveBeenCalled();
  });

});
