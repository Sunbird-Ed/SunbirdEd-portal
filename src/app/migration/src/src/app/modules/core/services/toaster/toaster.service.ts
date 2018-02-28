import { Injectable } from '@angular/core';
import { Ng2IzitoastService } from 'ng2-izitoast';

/**
 * Service to show toaster
 *
 */
@Injectable()

/**
 * ToasterService helps to change the config of
 * the iziToast
 */
export class ToasterService {

  /**
   * To show toaster messages
   */
  public iziToast: Ng2IzitoastService;

  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of ToasterService class
	 *
   * @param {Ng2IzitoastService} iziToast To show toaster messages
	 */
  constructor(iziToast: Ng2IzitoastService) {
    this.iziToast = iziToast;
    this.iziToast.settings({
      position: 'topCenter',
      titleSize: '18'
    });
  }

  /**
   * Format success message
   * @memberOf Services.toasterService
   * @param {string}  message - Success message
   */
  success(message: string) {
    this.iziToast.success({
      title: message
    });
  }

  /**
   * Format information message
   * @memberOf Services.toasterService
   * @param {string}  message - Info message
   */
  info(message: string) {
    this.iziToast.info({
      title: message
    });
  }

  /**
   * Format error message
   * @memberOf Services.toasterService
   * @param {string}  message - Error message
   */
  error(message: string) {
    this.iziToast.error({
      title: message
    });
  }

  /**
   * Format warning message
   * @memberOf Services.toasterService
   * @param {string}  message - Warning message
   */
  warning(message: string) {
    this.iziToast.warning({
      title: message
    });
  }
}
