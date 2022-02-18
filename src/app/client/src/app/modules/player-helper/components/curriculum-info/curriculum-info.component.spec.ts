import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService } from '@sunbird/shared';
import { CurriculumInfoComponent, ICurriculum } from './curriculum-info.component';
import { configureTestSuite } from '@sunbird/test-util';

describe('CurriculumInfoComponent', () => {
  let component: CurriculumInfoComponent;
  let fixture: ComponentFixture<CurriculumInfoComponent>;

  const resourceServiceMockData = {
    frmelmnts: {
      lbl: {
        pdfcontents: 'Pdf contents',
        videos: 'Videos',
        imagecontents: 'Image Contents',
        htmlarchives: 'Html Archives',
        ecmlarchives: 'Ecml Archives',
        epubarchives: 'Epub Archives',
        h5parchives: 'H5p Archives'
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurriculumInfoComponent],
      providers: [{ provide: ResourceService, useValue: resourceServiceMockData }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculumInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.mimeTypeList = [
      { mimeType: 'application/pdf', count: 2 },
      { mimeType: 'video', count: 2 },
      { mimeType: 'image', count: 2 },
      { mimeType: 'application/vnd.ekstep.html-archive', count: 2 },
      { mimeType: 'application/vnd.ekstep.ecml-archive', count: 2 },
      { mimeType: 'application/epub', count: 2 },
      { mimeType: 'application/vnd.ekstep.h5p-archive', count: 2 }
    ];
    const expectedCurriculum: ICurriculum[] = [
      { label: 'Pdf contents', count: 2, class: 'file pdf outline icon' },
      { label: 'Videos', count: 2, class: 'file video outline icon' },
      { label: 'Image Contents', count: 2, class: 'file image outline icon' },
      { label: 'Html Archives', count: 2, class: 'html5 icon' },
      { label: 'Ecml Archives', count: 2, class: 'file archive outline icon' },
      { label: 'Epub Archives', count: 2, class: 'file archive outline icon' },
      { label: 'H5p Archives', count: 2, class: 'file archive outline icon' }
    ];
    component.ngOnInit();
    expect(component.curriculum).toEqual(expectedCurriculum);
  });
});
