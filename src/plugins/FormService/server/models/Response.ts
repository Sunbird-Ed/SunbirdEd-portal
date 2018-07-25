import { Util } from 'ext-framework-server/Util';
import * as _ from 'lodash';

export class FormResponse {
  private id: string;
  private ver: string;
  private ts: Date;
  private params: any;
  private responseCode: string = "";
  private result: any = {};

  constructor(error?, result?) {
    this.id = _.get(result, 'id') || _.get(error, 'id');
    this.ver = "1.0";
    this.ts = new Date();
    this.params = {
      resmsgid: Util.UUID(),
      msgid: Util.UUID()
    }

    if(error) {
      this.params.status = "failed";
      this.params.err = error.err;
      this.params.errmsg = error.errmsg;
      this.responseCode = error.responseCode || "SERVER_ERROR";
    }

    if (result) {
      this.params.status = "successful";
      this.responseCode = "OK";
      this.result = result.data;
    }
    // order the object keys for response
    return Object.keys(this).sort().reduce((r, k) => (r[k] = this[k], r), {}) as FormResponse;
  }
}