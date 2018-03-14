import { Component } from '@angular/core';
/**
 * Main menu component
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  /**
   * Sui dropdown initiator
   */
  isOpen: boolean;
}
