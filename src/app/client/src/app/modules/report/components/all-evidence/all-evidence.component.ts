import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { DhitiService } from '@sunbird/core';
import { LocationStrategy } from '@angular/common';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-all-evidence',
  templateUrl: './all-evidence.component.html',
  styleUrls: ['./all-evidence.component.scss'],
})
export class AllEvidenceComponent implements OnInit {
  @ViewChild('modal') modal;
  @Output() closeEvent = new EventEmitter<any>();
  @Input() data: any;
  public throttle = 50;
  public scrollDistance = 2;
  activeIndex:any = 0;
  config;
  remarks: any = [];
  images: any = [];
  videos: any = [];
  documents: any = [];
  audios: any = [];
  constructor(
    public resourceService: ResourceService,
    config: ConfigService,
    private dhitiService: DhitiService,
    public location: LocationStrategy
  ) {
    this.config = config;
    this.location.onPopState(() => {
      this.modal.deny();
   });
  }

  ngOnInit() {
    const config = {
      url: this.config.urlConFig.URLS.DHITI.ALL_EVIDENCE,
      data: this.data,
    };
    this.dhitiService.post(config).subscribe(
      (success: any) => {
        if (success.result === true && success.data) {
          this.images = success.data.images;
          this.videos = success.data.videos;
          this.documents = success.data.documents;
          this.remarks = success.data.remarks;
          this.audios = success.data.audios;
        }
      },
      (error) => {}
    );
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.activeIndex = tabChangeEvent.index
  }

  public closeModal() {
    this.closeEvent.emit({ value: null });
  }
}
