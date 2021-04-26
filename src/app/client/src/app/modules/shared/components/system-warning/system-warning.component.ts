import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SystemInfoService } from '../../../public/module/offline/services/system-info/system-info.service';
import { ResourceService } from '../../services/resource/resource.service';

@Component({
  selector: 'app-system-warning',
  templateUrl: './system-warning.component.html',
  styleUrls: ['./system-warning.component.scss']
})
export class SystemWarningComponent implements OnInit, OnDestroy {

  readonly MAXIMUM_CPU_LOAD = 90;
  readonly MINIMUM_REQUIRED_RAM = 100;

  showMinimumRAMWarning = false;
  showCpuLoadWarning = false;
  unsubscribe$ = new Subject<void>();
  constructor(
    public resourceService: ResourceService,
    private systemInfoService: SystemInfoService
  ) { }

  ngOnInit() {
    this.getSystemInfo();
  }

  private getSystemInfo() {
    this.systemInfoService.getSystemInfo().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      let { availableMemory } = data.result;
      availableMemory = Math.floor(availableMemory / (1024 * 1024));
      const availableCpuLoad = _.get(data.result, 'cpuLoad');
      this.showCpuLoadWarning = availableCpuLoad ? Boolean(availableCpuLoad > this.MAXIMUM_CPU_LOAD) : false;
      this.showMinimumRAMWarning = availableMemory ? Boolean(availableMemory < this.MINIMUM_REQUIRED_RAM) : false;
    }, error => {
      this.showCpuLoadWarning = false;
      this.showMinimumRAMWarning = false;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
