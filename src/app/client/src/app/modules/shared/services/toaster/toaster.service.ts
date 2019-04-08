import { Injectable } from '@angular/core';

/**
 * Service to show toaster
 *
 */
@Injectable()
export class ToasterService {

  /**
   * To show toaster messages
   */
  public iziToast: any;

  /**
	 * Constructor to create injected service(s) object
	 */
  constructor() {
    this.iziToast = iziToast; // global object
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
