import { Component, Output, EventEmitter, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es';
import { ResourceService } from '@sunbird/shared';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-global-search-filter',
  templateUrl: './global-search-filter.component.html',
  styleUrls: ['./global-search-filter.component.scss']
})
export class GlobalSearchFilterComponent implements OnInit, OnDestroy {
  @Input() facets: { name: string, label: string, index: string, placeholder: string, values: { name: string, count: number }[] }[];
  public selectedFilters = {};
  public refresh = true;
  public filterChangeEvent = new Subject();
  private unsubscribe$ = new Subject<void>();
  public resetFilterInteractEdata: IInteractEventEdata;
  @Input() layoutConfiguration;
  @Input() isOpen;
  @Output() filterChange: EventEmitter<{ status: string, filters?: any }> = new EventEmitter();
  constructor(public resourceService: ResourceService, public router: Router,
    private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.setResetFilterInteractData();
    this.fetchSelectedFilterAndFilterOption();
    this.handleFilterChange();
        // screen size
        if (window.innerWidth <= 992 ) {
          this.isOpen = false;
        }
  }

  public resetFilters() {
    this.selectedFilters = _.pick(this.selectedFilters, ['key']);
    let redirectUrl; // if pageNumber exist then go to first page every time when filter changes, else go exact path
    if (_.get(this.activatedRoute, 'snapshot.params.pageNumber')) { // when using dataDriven filter should this should be verified
      redirectUrl = this.router.url.split('?')[0].replace(/[^\/]+$/, '1');
    } else {
      redirectUrl = this.router.url.split('?')[0];
    }
    redirectUrl = decodeURI(redirectUrl);
    this.router.navigate([redirectUrl], { relativeTo: this.activatedRoute.parent, queryParams: this.selectedFilters });
    this.hardRefreshFilter();
  }

  private fetchSelectedFilterAndFilterOption() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$),
      map((queryParams) => {
        const queryFilters: any = {};
        _.forIn(queryParams, (value, key) => {
          if (['medium', 'gradeLevel', 'board', 'channel', 'subject', 'contentType', 'key'].includes(key)) {
            queryFilters[key] = key === 'key' || _.isArray(value) ? value : [value];
          }
        });
        return queryFilters;
      })).subscribe(filters => {
        this.selectedFilters = _.cloneDeep(filters);
        this.emitFilterChangeEvent(true);
        this.hardRefreshFilter();
      }, error => {
        console.error('fetching filter data failed', error);
      });
  }

  private handleFilterChange() {
    this.filterChangeEvent.pipe(debounceTime(1000)).subscribe(({ type, event }) => {
      this.emitFilterChangeEvent();
    });
  }

  private updateRoute() {
    this.router.navigate([], {
      queryParams: this.selectedFilters,
      relativeTo: this.activatedRoute.parent
    });
  }

  private emitFilterChangeEvent(skipUrlUpdate = false) {
    this.filterChange.emit({ status: 'FETCHED', filters: this.selectedFilters });
    if (!skipUrlUpdate) {
      this.updateRoute();
    }
  }

  private hardRefreshFilter() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  private setResetFilterInteractData() {
    setTimeout(() => { // wait for model to change
      this.resetFilterInteractEdata = {
        id: 'reset-filter',
        type: 'click',
        pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
        extra: { filters: this.selectedFilters }
      };
    }, 5);
  }

  removeFilterSelection(data) {
    _.map(this.selectedFilters, (value, key) => {
      if (this.selectedFilters[data.type] && !_.isEmpty(this.selectedFilters[data.type])) {
        _.remove(value, (n) => {
          return n === data.value;
        });
      }
      if (_.isEmpty(value)) { delete this.selectedFilters[key]; }
    });
    this.filterChange.emit({ status: 'FETCHED', filters: this.selectedFilters });
    this.updateRoute();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
