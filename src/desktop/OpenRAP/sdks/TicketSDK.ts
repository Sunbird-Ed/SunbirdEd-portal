import { Singleton } from "typescript-ioc";
import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { Inject } from "typescript-ioc";
import SystemSDK from "./SystemSDK";
import NetworkSDK from "./NetworkSDK";
import DeviceSDK from './DeviceSDK';
import { HTTPService } from "@project-sunbird/ext-framework-server/services";
const FormData = require('form-data');
import { ClassLogger } from '@project-sunbird/logger/decorator';

/* @ClassLogger({
  logLevel: "debug",
  logTime: true
}) */
@Singleton
export class TicketSDK {

  @Inject private networkSDK: NetworkSDK;
  @Inject private systemSDK: SystemSDK;
  @Inject private deviceSDK: DeviceSDK;
  constructor() { }

  async createTicket(ticketReq: ITicketReq): Promise<{ message: string, code: string, status: number }> {
    if (!ticketReq || !ticketReq.email || !ticketReq.description) {
      throw {
        status: 400,
        code: 'MANDATORY_FIELD_MISSING',
        message: 'Mandatory fields are missing'
      }
    }
    const networkAvailable = await this.networkSDK.isInternetAvailable();
    if (!networkAvailable) {
      throw {
        status: 400,
        code: 'NETWORK_UNAVAILABLE',
        message: 'Network unavailable'
      }
    }
    const deviceId = await this.systemSDK.getDeviceId();
    const deviceInfo: any = await this.systemSDK.getDeviceInfo();
    const networkInfo: any = await this.systemSDK.getNetworkInfo();
    let apiKey = await this.deviceSDK.getToken(deviceId);
    deviceInfo.networkInfo = _.map(networkInfo, item => {
      delete item.ip4;
      delete item.ip6;
      delete item.mac;
      return item;
    })
    deviceInfo.cpuLoad = await this.systemSDK.getCpuLoad();
    const formData = new FormData();
    formData.append('status', 2);
    formData.append('priority', 2);
    formData.append('description', ticketReq.description);
    formData.append('subject', `${process.env.APP_NAME} Desktop App Support request - ${deviceId}`)
    formData.append('email', ticketReq.email);
    formData.append('custom_fields[cf_ticket_current_status]', "FD-L1-Unclassified");
    formData.append('custom_fields[cf_severity]', "S2");
    formData.append('custom_fields[cf_reqeststatus]', "None");
    formData.append('custom_fields[cf_reasonforseverity]', "Offline Desktop App Query");
    formData.append('attachments[]', JSON.stringify(deviceInfo), { filename: 'deviceSpec.json', contentType: 'application/json' });
    const headers = {
      authorization: `Bearer ${apiKey}`,
      ...formData.getHeaders(),
    }
    return HTTPService.post(`${process.env.APP_BASE_URL}/api/tickets/v1/create`, formData, {headers}).toPromise()
    .then((data: any) => {
      logger.info('Ticket created successfully', data.data);
      return {
        status: 200,
        code: 'SUCCESS',
        message: 'Ticket created successfully'
      }
    })
    .catch(error => {
      logger.error('Error while creating tickets', _.get(error, 'response.data') || error.message);
      throw {
        status: _.get(error, 'response.status') || 400,
        code: _.get(error, 'response.data.code') || 'FRESH_DESK_API_ERROR',
        message: error.message
      };
    });
  }
}
export interface ITicketReq {
  email: string,
  description: string;
}