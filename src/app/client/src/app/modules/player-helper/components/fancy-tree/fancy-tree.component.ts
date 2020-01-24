import { Component, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import 'jquery.fancytree';
import { IFancytreeOptions } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { TelemetryInteractDirective } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-fancy-tree',
  templateUrl: './fancy-tree.component.html'
})
export class FancyTreeComponent implements AfterViewInit {
  @ViewChild('fancyTree') public tree: ElementRef;
  @Input() public nodes: any;
  @Input() public options: any;
  @Input() public rootNode;
  @Output() public itemSelect: EventEmitter<Fancytree.FancytreeNode> = new EventEmitter();
  @ViewChild(TelemetryInteractDirective) telemetryInteractDirective: TelemetryInteractDirective;
  constructor(public activatedRoute: ActivatedRoute) { }
  ngAfterViewInit() {
    let options: any = {
      extensions: ['glyph'],
      clickFolderMode: 3,
      source: this.nodes,
      glyph: {
        preset: 'awesome4',
        map: {
          folder: 'icon folder sb-fancyTree-icon',
          folderOpen: 'icon folder outline sb-fancyTree-icon'
        }
      },
      click: (event, data): boolean => {
        this.telemetryInteractDirective.telemetryInteractObject = this.getTelemetryInteractObject(_.get(data, 'node.data'));
        this.telemetryInteractDirective.telemetryInteractEdata = this.getTelemetryInteractEdata();
        this.telemetryInteractDirective.telemetryInteractCdata = _.get(this.activatedRoute, 'snapshot.queryParams.dialCode') ?
        [{id: _.get(this.activatedRoute, 'snapshot.queryParams.dialCode'), type: 'dialCode'}] : [];
        this.tree.nativeElement.click();
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

  getTelemetryInteractObject(data) {
    return {
      id: _.get(data, 'id'),
      type: _.get(data, 'model.contentType') || 'Content',
      ver: _.get(data, 'model.pkgVersion') || '1.0',
      rollup: {
        l1: _.get(this.rootNode, 'id')
      }
    };
  }

  getTelemetryInteractEdata() {
    return {
      id: 'course-toc',
      type: 'click',
      pageid: 'course-read'
    };
  }
}
