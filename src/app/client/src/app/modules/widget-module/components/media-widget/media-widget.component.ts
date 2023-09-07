import { Component, Input,Output, OnInit,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-media-widget',
  templateUrl: './media-widget.component.html',
  styleUrls: ['./media-widget.component.scss']
})
export class MediaWidgetComponent implements OnInit {
  
  @Input() telemetryImp;//TracingTelemetryImpressions
  @Input() collData;//CollectionData
  @Input() playerConfiguration;//PlayerConfiguration
  @Input() activeCon;//CurrentlyActiveContent
  @Input() rollup;
  @Input() tocPage;
  @Input() select;//selectall
  @Input() selectmode;
  @Input() telemetryInt;
  @Input() tie;
  @Input() tic;
  @Input() isContentPresent;
  @Input() platform;
  @Input() type;
  @Input() ImageDefault;
  @Input() activeMimeType ;
  @Output() CardClickHandler = new EventEmitter<any>();
  @Output() showContent = new EventEmitter<any>();
  @Output() thatItemSelected = new EventEmitter<any>();
  @Input() noContentMessage;  
  constructor() { }

  ngOnInit(): void {
    console.log('telemetryImp:', this.telemetryImp);
    console.log('collData:', this.collData);
  }
  public ClickHandler(event){
    this.CardClickHandler.emit(event);
  }
  public ShowContentorNot(event){
    this.showContent.emit(event);
  }
  public ItemThatIsSelected(event){
    this.thatItemSelected.emit(event);
  }
}
