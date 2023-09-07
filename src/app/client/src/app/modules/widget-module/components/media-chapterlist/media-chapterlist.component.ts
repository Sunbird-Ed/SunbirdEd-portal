import { Component, OnInit, Input, EventEmitter, Output ,Inject} from '@angular/core';
import { ResourceService } from '../contentpageinterfaces';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-media-chapterlist',
  templateUrl: './media-chapterlist.component.html',
  styleUrls: ['./media-chapterlist.component.scss']
})
export class MediaChapterlistComponent implements OnInit {

  @Input() contentDetails; // Removed 'any'
  @Input() selectAll;
  @Input() selectMode;
  @Input() activeMimeTypeFilter;
  @Input() tocData;
  @Input() platform;
  @Input() type;
  @Input() trackableDefaultImage;
  @Input() noContentMessage;
  @Input() activeContent;
  @Input() appTelemetryInteract;
  @Input() telemetryInteractEdata;
  @Input() telemetryInteractCdata;
  @Input() image;
  instance:string;
  @Output() clickedcard = new EventEmitter<any>();//tocCardclick
  @Output() noCon = new EventEmitter<any>(); //nocontent
  @Output() ItemieSelected = new EventEmitter<any>();//itemselected
  @Output() tocChapterClicked: EventEmitter<any> = new EventEmitter(); //ontocchapterclick
  constructor(@Inject('ContentpageService') public resourceService: ResourceService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }

  public async onTocChapterClick(event, content) {
    
    if (this.activeContent && this.activeContent.sbUniqueIdentifier !== content.sbUniqueIdentifier) {
      this.tocChapterClicked.emit({ event: event, data: { ...content } });
    }
  }
  nocontent(event){
    this.noCon.emit(event);
  }
  tocCardClick(event){
    this.clickedcard.emit(event);
  }
  selectedItem(event){
    this.ItemieSelected.emit(event);
  }
}
