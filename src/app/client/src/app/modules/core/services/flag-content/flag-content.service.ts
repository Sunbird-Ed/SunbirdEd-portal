import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class FlagContentService {

  /**
   * An event emitter to update the status of the flag.
   */
  disableFlagOnSuccess = new EventEmitter<boolean>();

  /**
   * This method can be used to disable a flag for a select component.
   */
  public updateFlag() {
    this.disableFlagOnSuccess.emit(true);
  }

}
