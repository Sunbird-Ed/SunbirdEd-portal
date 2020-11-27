import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { map, omit, get, remove } from 'lodash-es';

@Component({
  selector: 'app-selected-filters',
  templateUrl: './selected-filters.component.html',
  styleUrls: ['./selected-filters.component.scss']
})
export class SelectedFiltersComponent implements OnChanges {

  filters = [];
  @Input() selectedFilters;
  @Input() keysToOmit = ['channel'];

  constructor(private router: Router, public resourceService: ResourceService, private activatedRoute: ActivatedRoute) { }

  ngOnChanges() {
    this.filters = map(omit(this.selectedFilters || {}, this.keysToOmit), (value, key) => ({ key, value }));
  }

  private updateRoute() {
    const selectedTab = get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'textbook';
    this.router.navigate([], {
      queryParams: { selectedTab, ...(this.selectedFilters || {}) },
      relativeTo: this.activatedRoute.parent
    });
  }

  removeSelection({ type, value }) {
    const selectedValues = get(this.selectedFilters, type) || [];
    remove(selectedValues, selectedValue => {
      return selectedValue === value;
    });
    this.updateRoute();
  }

}
