import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-global-search-selected-filter',
  templateUrl: './global-search-selected-filter.component.html',
  styleUrls: ['./global-search-selected-filter.component.scss']
})
export class GlobalSearchSelectedFilterComponent {
  @Input() facets: { name: string, label: string, index: string, placeholder: string, values: { name: string, count?: number }[] }[];
  @Input() selectedFilters;
  @Output() filterChange: EventEmitter<{ status: string, filters?: any }> = new EventEmitter();

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public resourceService: ResourceService) { }

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

  public updateRoute() {
    if (this.selectedFilters.channel) {
      const channelIds = [];
      const facetsData = _.find(this.facets, {'name': 'channel'});
      _.forEach(this.selectedFilters.channel, (value, index) => {
        const data = _.find(facetsData.values, {'name': value});
        channelIds.push(data.identifier);
      });
      this.selectedFilters.channel = channelIds;
    }
    this.router.navigate([], {
      queryParams: this.selectedFilters,
      relativeTo: this.activatedRoute.parent
    });
  }
}
