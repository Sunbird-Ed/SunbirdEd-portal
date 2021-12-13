import { Component, Input, HostListener, ElementRef, Output, EventEmitter, OnChanges,ViewChild,ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-material-auto-complete',
  templateUrl: './material-auto-complete.component.html',
  styleUrls: ['./material-auto-complete.component.scss']
})
export class MaterialAutoCompleteComponent implements OnChanges {


  _selectedFilters: Array<any>;
  @Input()
  get selectedFilters() {  
    return this._selectedFilters;
  }
  set selectedFilters(val) {
    this._selectedFilters = val;
    this.selected = val;
    this.dropDownSelectedShow();

  }

  _dropdownList: Array<any>;
  selected =[];

  @Input()
  get dropdownList() {  
    return this._dropdownList;
  }

  set dropdownList(val) {

    this._dropdownList = val;
    this.dropDownSelectedShow();
  }

  @ViewChild("autocompleteInput") searchField: ElementRef;

  @Output() selectionChanged: EventEmitter<any> = new EventEmitter<any>();

  displayDropdown = false;
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!(this._elementRef && this._elementRef.nativeElement.contains(event.target))) {
      this.displayDropdown = false;
    }
  }

  @Input()
  get placeholder(): string { return this._placeholder; }
  set placeholder(value: string) {
    this._placeholder = "0 selections";

  }
  private _placeholder: string;

  constructor(private _elementRef: ElementRef<HTMLElement>,private changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges() {
    if (!this.dropdownList) {
      throw new TypeError('\'dropdownList\' is Required');
    } else if (!(this.dropdownList instanceof Array)) {
      throw new TypeError('\'dropdownList\' should be an Array of objects');
    }  
  }

  DropdownValueSelected(listItem){
    if(listItem){
      if(this.selected.includes(listItem)){
        this.selected = this.selected.filter(item=>{
          if(item == listItem){
            return false
          } else {
            return true
          }
        })

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
      this.writeValue(`0 selections`);
    }

  }

  DisplayDropdown() {
    this.displayDropdown = true;
    this.changeDetectorRef.detectChanges();
    setTimeout(()=>{
        this.searchField.nativeElement.focus();
    },100)

  }
  isChecked(item){

    if(this.selected.includes(item)){
      return true;
    } else {
      return false;
    }
  }

  @Input() _selectedDpdwnInput: any;
  get selectedDpdwnInput() {
    return this._selectedDpdwnInput;
  }

  set selectedDpdwnInput(val) {
    this._selectedDpdwnInput = val;
  }

  writeValue(value?: any) {
    this.selectedDpdwnInput = value;
  }


}