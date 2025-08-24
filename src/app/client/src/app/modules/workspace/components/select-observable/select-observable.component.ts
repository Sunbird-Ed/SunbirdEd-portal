import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface SelectObservableOption {
  identifier: string;
  code: string;
  name: string;
  [key: string]: any;
}

export interface SelectObservableConfig {
  type: 'single' | 'multi';
}

@Component({
  selector: 'app-select-observable',
  templateUrl: './select-observable.component.html',
  styleUrls: ['./select-observable.component.scss']
})
export class SelectObservableComponent implements OnInit {
  @Input() options: SelectObservableOption[] = [];
  @Input() config: SelectObservableConfig = { type: 'single' };
  @Input() placeholder: string = '';
  @Input() selected: SelectObservableOption[] = [];
  @Input() noOptionsFoundText: string = '';
  @Input() selectedElementsText: string = '';
  @Output() selectedChange = new EventEmitter<SelectObservableOption[]>();

  searchTerm = '';

  get filteredOptions(): SelectObservableOption[] {
    return this.options
      .filter(opt =>
        (!this.selected.some(sel => sel.identifier === opt.identifier)) &&
        (opt.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         opt.code.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
  }

  ngOnInit() {
    if (!this.selected) this.selected = [];
  }

  selectOption(option: SelectObservableOption) {
    if (this.config.type === 'multi') {
      this.selected = [...this.selected, option];
    } else {
      this.selected = [option];
    }
    this.selectedChange.emit(this.selected);
    // Clear search when option is selected for better UX
    this.searchTerm = '';
  }

  removeOption(option: SelectObservableOption) {
    this.selected = this.selected.filter(sel => sel.identifier !== option.identifier);
    this.selectedChange.emit(this.selected);
  }
}