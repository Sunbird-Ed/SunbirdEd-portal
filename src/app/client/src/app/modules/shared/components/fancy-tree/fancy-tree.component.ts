import { Component, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import 'jquery.fancytree';
import { IFancytreeOptions } from '../../interfaces';

@Component({
  selector: 'app-fancy-tree',
  templateUrl: './fancy-tree.component.html',
  styles: [`
  ::ng-deep .fancytree-plain span.fancytree-node span.fancytree-title {
      margin-left: 5px;
      vertical-align: middle;
      padding-top: 4px;
      padding-bottom: 4px;
  }
  ::ng-deep span.fancytree-active span.fancytree-title {
      background-color: #007Aff;
      color: #fff;
  }
  ::ng-deep span.fancytree-icon {
    vertical-align: middle;
  }
  ::ng-deep span.fancytree-expander {
    vertical-align: middle;
  }
  `]
})
export class FancyTreeComponent implements AfterViewInit {
  @ViewChild('fancyTree') public tree: ElementRef;
  @Input() public nodes: any;
  @Input() public options: IFancytreeOptions;
  @Output() public itemSelect: EventEmitter<Fancytree.FancytreeNode> = new EventEmitter();

  ngAfterViewInit() {
    let options: IFancytreeOptions = {
      extensions: ['glyph'],
      clickFolderMode: 3,
      source: this.nodes,
      glyph: {
        preset: 'awesome4',
        map: {
          folder: 'fa fa-book fa-lg',
          folderOpen: 'fa fa-book-open fa-lg'
        }
      },
      click: (event, data): boolean => {
        const node = data.node;
        this.itemSelect.emit(node);
        return true;
      },
    };
    options = { ...options, ...this.options };
    $(this.tree.nativeElement).fancytree(options);
    if (this.options.showConnectors) {
      $('.fancytree-container').addClass('fancytree-connectors');
    }
  }
}
