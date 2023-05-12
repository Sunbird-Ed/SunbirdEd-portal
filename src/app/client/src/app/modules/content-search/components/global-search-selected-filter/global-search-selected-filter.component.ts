import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, UtilService } from '@sunbird/shared';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-global-search-selected-filter',
  templateUrl: './global-search-selected-filter.component.html',
  styleUrls: ['./global-search-selected-filter.component.scss']
})
export class GlobalSearchSelectedFilterComponent implements OnInit {
  @Input() facets: { name: string, label: string, index: string, placeholder: string, values: { name: string, count?: number }[] }[];
  @Input() selectedFilters;
  @Input() queryParamsToOmit;
  @Output() filterChange: EventEmitter<{ status: string, filters?: any }> = new EventEmitter();
  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public resourceService: ResourceService, private utilService: UtilService) { }

  ngOnInit() {
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe((languageData) => {
      if (this.facets) {
        this.facets.forEach((facet) => {
          facet['label'] = this.utilService.transposeTerms(facet['label'], facet['label'], this.resourceService.selectedLang);
        });
      }
    });
  }

  removeFilterSelection(data) {
    _.map(this.selectedFilters, (value, key) => {
      if (this.selectedFilters[data.type] && !_.isEmpty(this.selectedFilters[data.type])) {
        _.remove(value, (n) => {
          return n === data.value && data.type === key;
        });
      }
      if (_.isEmpty(value)) { delete this.selectedFilters[key]; }
    });
    this.filterChange.emit({ status: 'FETCHED', filters: this.selectedFilters });
    this.updateRoute();
  }

  public updateRoute() {
    let queryFilters = _.get(this.activatedRoute, 'snapshot.queryParams');
    if (this?.selectedFilters?.channel) {
      const channelIds = [];
      const facetsData = _.find(this.facets, {'name': 'channel'});
      _.forEach(this.selectedFilters.channel, (value, index) => {
        const data = _.find(facetsData.values, {'name': value});
        channelIds.push(data.identifier);
      });
      this.selectedFilters.channel = channelIds;
    }
    if (!_.get(this.selectedFilters, 'selectedTab') && _.get(queryFilters, 'selectedTab')) {
      this.selectedFilters['selectedTab'] = _.get(queryFilters, 'selectedTab');
    }
    if (this.queryParamsToOmit) {
      queryFilters = _.omit(_.get(this.activatedRoute, 'snapshot.queryParams'), this.queryParamsToOmit);
    }
    queryFilters = {...queryFilters, ...this.selectedFilters};
    this.router.navigate([], {
      queryParams: queryFilters,
      relativeTo: this.activatedRoute.parent
    });
  }

  showLabel() {
    if((Object.keys(this.selectedFilters).length == 0) || (Object.keys(this.selectedFilters).length == 1 && _.get(this.selectedFilters, 'selectedTab') == 'all')) {
      return false
    } else {
      return true;
    }
  }
}
