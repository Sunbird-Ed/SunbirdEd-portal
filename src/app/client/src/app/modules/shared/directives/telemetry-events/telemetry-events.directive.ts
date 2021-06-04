import { Directive, HostListener, OnInit, Input, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { TelemetryService } from '@sunbird/telemetry';
import { UtilService } from '@sunbird/shared';
/**
 * Reference links:
 * https://www.tektutorialshub.com/angular/renderer2-angular/
 * https://medium.com/claritydesignsystem/four-ways-of-listening-to-dom-events-in-angular-part-3-renderer2-listen-14c6fe052b59
 */
@Directive({
  selector: '[telemetryEventsButton]'
})
export class TelemetryEventsDirective implements OnInit {

  //Component
  // @ViewChild('telemetryButton', { static: false }) telButton: ElementRef;

  // @Input() set telemetryEventsButton(showButton:boolean) {
  //   this.showButton = showButton;
  //   console.log("Show telemetry events button: ", this.showButton);
  // } 

  constructor(private elementRef: ElementRef, 
    private telemetryService: TelemetryService, 
    private utilService: UtilService,
    private renderer2: Renderer2) { 

  }

  // showButton = false;
  unlistenTelemetryEventShow;
  unlistenTelemetryEvent;
  
  ngOnInit() {
    console.log("directive initialized..");
    this.unlistenTelemetryEventShow = this.renderer2.listen('document', "TelemetryEvent:show", event => {
      this.showTelemetryOption(event);
    });

    // Reference: https://github.com/project-sunbird/sunbird-telemetry-sdk/blob/master/js/core/telemetryV3Interface.js
    this.unlistenTelemetryEvent = this.renderer2.listen('document', "TelemetryEvent", event => {
      this.telemetryEventHandler(event);
    });

    this.showOrHideElement(false);  
    // var instance = this;
    // document.addEventListener("TelemetryEvent:show",instance.showTelemetryOption );
    // document.addEventListener("TelemetryEvent",instance.telemetryEventHandler );
  }

  // @HostListener('document:TelemetryEvent:show', ['$event']) 
  showTelemetryOption(event) { 
    let showButton = event.detail && event.detail.show ? true : false;
    this.showOrHideElement(showButton)
  }

  showOrHideElement(show:boolean) {
    this.renderer2.setStyle(this.elementRef.nativeElement, "display", show? "block" : "none");
  }

  // @HostListener('document:TelemetryEvent', ['$event'])
  telemetryEventHandler(event) {
    let telemetryEvents = this.telemetryService.telemetryEvents;
    let latestEvent = telemetryEvents && telemetryEvents[0];
    if(event && event.detail) {
      let teleEvent = event.detail;
      if(latestEvent && (latestEvent.mid == teleEvent.mid)){
        // Avoid duplicate events adding to the list
        return;
      }

      // To add only Error events to the list
      if(teleEvent.eid && (teleEvent.eid.toLowerCase() === "interact")) {
        let flatJson = this.utilService.flattenObject(teleEvent);
        this.telemetryService.telemetryEvents.push(flatJson);       
      }

      console.log(event);
    }
  }

}
