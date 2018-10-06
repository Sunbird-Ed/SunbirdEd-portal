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
      folderIcon: 'fa fa-folder-o fa-lg',
      fileIcon: 'fa fa-file-o fa-lg',
      customFileIcon: {
        'video': 'fa fa-file-video-o fa-lg',
        'pdf': 'fa fa-file-pdf-o fa-lg',
        'youtube': 'fa fa-youtube fa-lg',
        'H5P': 'fa fa-html5 fa-lg',
        'audio': 'fa fa-file-audio-o fa-lg',
        'ECML': 'fa fa-code-o fa-lg',
        'HTML': 'fa fa-html5-o fa-lg',
        'collection': 'fa fa-file-archive-o fa-lg',
        'epub': '',
        'doc': ''
      }
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
