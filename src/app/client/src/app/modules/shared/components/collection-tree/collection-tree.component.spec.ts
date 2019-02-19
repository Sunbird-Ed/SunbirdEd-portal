import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionTreeComponent } from './collection-tree.component';
import { SuiAccordionModule } from 'ng2-semantic-ui';
import { FancyTreeComponent } from '..';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
// Import services
import { ResourceService, BrowserCacheTtlService, ConfigService } from '../../services/index';
import { CacheService } from 'ng2-cache-service';
describe('CollectionTreeComponent', () => {
  let component: CollectionTreeComponent;
  let fixture: ComponentFixture<CollectionTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiAccordionModule, HttpClientTestingModule, HttpClientModule],
      declarations: [CollectionTreeComponent, FancyTreeComponent],
      providers: [ ResourceService, CacheService, ConfigService, BrowserCacheTtlService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTreeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.nodes = {
      data: {
        id: '1',
        title: 'node1',
        children: [{
          id: '1.1',
          title: 'node1.1'
        }, {
          id: '1.2',
          title: 'node1.2',
          children: [{
              id: '1.2.1',
              title: 'node1.2.1'
            }]
        }]
      }
    };

    component.options = {
      folderIcon: 'sb-icon-folder',
      fileIcon: 'sb-icon-content',
      customFileIcon: {
        'video': 'sb-icon-video',
        'pdf': 'sb-icon-doc',
        'youtube': 'sb-icon-video',
        'H5P': 'sb-icon-content',
        'audio': 'sb-icon-mp3',
        'ECML': 'sb-icon-content',
        'HTML': 'sb-icon-content',
        'collection': 'sb-icon-collection',
        'epub': 'sb-icon-doc',
        'doc': 'sb-icon-doc'
      }
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
