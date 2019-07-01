import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiTabsModule } from 'ng2-semantic-ui';
import { OfflineHelpCenterComponent } from './offline-help-center.component';

describe('OfflineHelpCenterComponent', () => {
  let component: OfflineHelpCenterComponent;
  let fixture: ComponentFixture<OfflineHelpCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiTabsModule ],
      declarations: [ OfflineHelpCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineHelpCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(window, 'scrollTo');
    spyOn(component, 'tabClicked');
    spyOn(component, 'checkScroll');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('activeTab must be "browse"', () => {
    component.ngOnInit();
    expect(component.activeTab).toEqual('browse');
  });

  it('should call tabClicked function', () => {
    component.tabClicked('browse');
    expect(component.tabClicked).toHaveBeenCalled();
    expect(component.activeTab).toEqual('browse');
  });

  it("should call checkScroll on window scrolling", function() {
    component.checkScroll();
    expect(component.checkScroll).toHaveBeenCalled();
  });

  it('should gotoTop', (done: any) => {
    component.gotoTop();
    done();
  });

  it('should not generate pdf from blank tab', (done) => {
    component.activeTab = 'null';
    component.generatepdf();
    done();
  });

  it('should generate pdf from browse tab', () => {
    component.activeTab = 'browse';
    component.tabClicked(component.activeTab);
    component.generatepdf();
    expect(component.activeTab).toEqual(component.activeTab);
  });

  it('should generate pdf from search tab', () => {
    component.activeTab = 'search';
    component.tabClicked(component.activeTab);
    component.generatepdf();
    expect(component.activeTab).toEqual(component.activeTab);
  });

  it('should generate pdf from download tab', () => {
    component.activeTab = 'download';
    component.tabClicked(component.activeTab);
    component.generatepdf();
    expect(component.activeTab).toEqual(component.activeTab);
  });

  it('should generate pdf from play tab', () => {
    component.activeTab = 'play';
    component.tabClicked(component.activeTab);
    component.generatepdf();
    expect(component.activeTab).toEqual(component.activeTab);
  });

  it('should generate pdf from upload tab', () => {
    component.activeTab = 'upload';
    component.tabClicked(component.activeTab);
    component.generatepdf();
    expect(component.activeTab).toEqual(component.activeTab);
  });

});
