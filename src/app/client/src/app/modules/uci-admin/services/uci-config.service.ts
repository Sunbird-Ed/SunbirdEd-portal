import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UciConfigService {
  private isUciEnabled: boolean = false;

  constructor() {
    const isUciEnabledString = (<HTMLInputElement>document.getElementById('isUciConfigured'))?.value;
    this.isUciEnabled = isUciEnabledString === 'true'; // Parse string to boolean
  }

  isUciAdminEnabled(): boolean {
    return this.isUciEnabled;
  }
}
