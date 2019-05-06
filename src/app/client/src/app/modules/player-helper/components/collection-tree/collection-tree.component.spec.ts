import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionTreeComponent } from './collection-tree.component';
import { SuiAccordionModule } from 'ng2-semantic-ui';
import { FancyTreeComponent } from '..';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
// Import services
import { ResourceService, BrowserCacheTtlService, ConfigService } from '@sunbird/shared';
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
      folderIcon: 'icon folder sb-fancyTree-icon',
      fileIcon: 'sb-icon-content sb-fancyTree-icon',
      customFileIcon: {
        'video': 'icon play circle sb-fancyTree-icon',
        'pdf': 'sb-icon-doc sb-fancyTree-icon',
        'youtube': 'icon play circle sb-fancyTree-icon',
        'H5P': 'sb-icon-content sb-fancyTree-icon',
        'audio': 'sb-icon-mp3 sb-fancyTree-icon',
        'ECML': 'sb-icon-content sb-fancyTree-icon',
        'HTML': 'sb-icon-content sb-fancyTree-icon',
        'collection': 'icon folder sb-fancyTree-icon',
        'epub': 'sb-icon-doc sb-fancyTree-icon',
        'doc': 'sb-icon-doc sb-fancyTree-icon'
      }
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
