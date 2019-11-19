import { Component, OnInit, OnDestroy } from '@angular/core';
import { PublicDataService } from '@sunbird/core';
import { ConfigService, ServerResponse, ResourceService } from '@sunbird/shared';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-offline-faq',
  templateUrl: './offline-faq.component.html',
  styleUrls: ['./offline-faq.component.scss']
})
export class OfflineFaqComponent implements OnInit, OnDestroy {

  public unsubscribe$ = new Subject<void>();
  faqData;
  constructor(public publicDataService: PublicDataService, public configService: ConfigService,
    public resourceService: ResourceService, public telemetryService: TelemetryService, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$))
    .subscribe(item => {
      this.fetchFaqs(item.value);
    });
  }
  handleEvents(event) {
    const interactData = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: []
      },
      edata: {
        id: event.data.action,
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        extra: {
          value: event.data.value,
          position: event.data.position
        }
      }
    };
    if (event.data.action === 'toggle-clicked') {
      interactData.edata.extra['isOpened'] = event.data.isOpened;
    }
    this.telemetryService.interact(interactData);
  }
  fetchFaqs(language = 'en') {
    const requestParams = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.READ_FAQ}/${language}`
    };
    this.publicDataService.get(requestParams).pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: ServerResponse) => {
        this.faqData = response.result.faqs;
      }, (error) => {
        if (language !== 'en') { // fetch default en faqs incase of faqs not found for selected language
          this.fetchFaqs('en');
        }
        console.log(`Received Error while fetching faqs ${JSON.stringify(error.error)}`);
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
