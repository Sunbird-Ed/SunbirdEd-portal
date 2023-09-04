import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'compass-header',
  templateUrl: './compass-header.component.html',
  styleUrls: ['./compass-header.component.scss']
})
export class CompassHeaderComponent implements OnInit {
  @Input() tenantInfo: any;
  @Input() userService: any;
  @Input() resourceService: any;
  @Input() userProfile: any;
  @Input() guestUser: any;
  @Input() hrefPath: any;
  @Input() avatarConfig: any;

  @Output() clearFilters = new EventEmitter();
  @Output() navigateToHome = new EventEmitter();
  @Output() toggleSidebar = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void { }

  navigateToHomepage(){
    this.navigateToHome.emit('');
  }

  clearCache(){
    this.clearFilters.emit('');
  }
  toggleSideMenu(boo){
    this.toggleSidebar.emit(boo)
  }
}
