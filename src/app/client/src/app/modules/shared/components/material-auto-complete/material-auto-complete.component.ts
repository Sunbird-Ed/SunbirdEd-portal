import { Component, Input, HostListener, ElementRef, Output, EventEmitter, OnChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ToasterService } from '../../services/toaster/toaster.service';

@Component({
  selector: 'app-material-auto-complete',
  templateUrl: './material-auto-complete.component.html',
  styleUrls: ['./material-auto-complete.component.scss']
})
export class MaterialAutoCompleteComponent implements OnChanges {
  @Input() dynamicplaceholder:string;
  @Input() dependency;
  @Input() checkFilters;
  @Input()
  get selectedFilters() {
    return this._selectedFilters;
  }
  set selectedFilters(val) {
    this._selectedFilters = val;
    this.selected = val;
    this.dropDownSelectedShow();

  }

  @Input()
  get dropdownList() {
    return this._dropdownList;
  }

  set dropdownList(val) {

    this._dropdownList = val;
    this.dropDownSelectedShow();
  }

  constructor(private _elementRef: ElementRef<HTMLElement>, private changeDetectorRef: ChangeDetectorRef, public toasterService: ToasterService) {}
  get selectedDpdwnInput() {
    return this._selectedDpdwnInput;
  }

  set selectedDpdwnInput(val) {
    this._selectedDpdwnInput = val;
  }


  _selectedFilters: Array<any>;

  _dropdownList: Array<any>;
  selected = [];

  @ViewChild('autocompleteInput') searchField: ElementRef;

  @Output() selectionChanged: EventEmitter<any> = new EventEmitter<any>();

  @Output() errorOutput: EventEmitter<any> = new EventEmitter<any>();

  displayDropdown = false;
  private _placeholder: string;

  @Input() _selectedDpdwnInput: any;
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!(this._elementRef && this._elementRef.nativeElement.contains(event.target))) {
      this.displayDropdown = false;
    }
  }

  ngOnChanges() {
    if (!this.dropdownList) {
      throw new TypeError('\'dropdownList\' is Required');
    } else if (!(this.dropdownList instanceof Array)) {
      throw new TypeError('\'dropdownList\' should be an Array of objects');
    }
  }

  DropdownValueSelected(listItem) {
    if (listItem) {
      if (this.selected.includes(listItem)) {
        this.selected = this.selected.filter(item => {
          if (item == listItem) {
            return false;
          } else {
            return true;
          }
        });

      } else {
        this.selected.push(listItem);
      }

    }
    this.selectionChanged.emit(this.selected);
    this.dropDownSelectedShow();
  }

  dropDownSelectedShow() {

     if (this.selected.length > 0) {
      this.writeValue(`${this.selected.length} selections`);
    } else {
      this.writeValue(`Select ${this.dynamicplaceholder.toLowerCase()}`);
    }

  }
  
  DisplayDropdown() {
    if(!this.dependency || (this.dependency && this.checkFilters && this.checkFilters[this.dependency.reference])){
      this.displayDropdown = true;
      this.changeDetectorRef.detectChanges();
      setTimeout(() => {
          this.searchField.nativeElement.focus();
      }, 100);
      this.errorOutput.emit(null)
    }else{
      this.errorOutput.emit({displayName: this.dependency.displayName})   
    }
  }
 
  isChecked(item) {

    if (this.selected.includes(item)) {
      return true;
    } else {
      return false;
    }
  }

  writeValue(value?: any) {
    this.selectedDpdwnInput = value;
  }

}