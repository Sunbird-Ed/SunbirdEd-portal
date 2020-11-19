import { TicketSDK } from './TicketSDK';
import { HTTPService } from "../services/httpService";
import { of, throwError } from 'rxjs';
import { networkError, helpDeskError, helpDeskSuccess, ticketReq, mandatoryFieldError } from './TicketSDK.spec.data';
const chai = require('chai'), spies = require('chai-spies');
chai.use(spies);
const spy = chai.spy.sandbox();
const expect = chai.expect;

describe('TicketSDK', async () => {
  let ticketSDK;
  beforeEach(async () => {
    ticketSDK = new TicketSDK();
  });
  afterEach(async () => {
    spy.restore();
  })
  it('should throw error if mandatory fields are not sent', async () => {
    await ticketSDK.createTicket().catch(err => {
      expect(err).to.deep.equal(mandatoryFieldError);
    });
    await ticketSDK.createTicket({email:"anoopm@ilimi.in"}).catch(err => {
      expect(err).to.deep.equal(mandatoryFieldError);
    });
    await ticketSDK.createTicket({description: "help"}).catch(err => {
      expect(err).to.deep.equal(mandatoryFieldError);
    });
  });
  it('should throw error if internet is not available', async () => {
    const isInternetAvailableSpy = spy.on(ticketSDK.networkSDK, 'isInternetAvailable', data => Promise.resolve(false));
    await ticketSDK.createTicket(ticketReq).catch(err => {
      expect(err).to.deep.equal(networkError);
      expect(isInternetAvailableSpy).to.have.been.called();
    });
  });
  it('should throw error if helpdesk api throws error', async () => {
    spy.on(ticketSDK.deviceSDK, 'getToken', data => Promise.resolve("api_key"));
    spy.on(ticketSDK.networkSDK, 'isInternetAvailable', data => Promise.resolve(true));
    let getDeviceIdSpy = spy.on(ticketSDK.systemSDK, 'getDeviceId', data => Promise.resolve('deviceId'));
    let getDeviceInfoSpy = spy.on(ticketSDK.systemSDK, 'getDeviceInfo', data => Promise.resolve({}));
    let getNetworkInfoSpy = spy.on(ticketSDK.systemSDK, 'getNetworkInfo', data => Promise.resolve({}));
    let getCpuLoadSpy = spy.on(ticketSDK.systemSDK, 'getCpuLoad', data => Promise.resolve({}));
    const HTTPServiceSpy = spy.on(HTTPService, 'post', data => throwError({message: helpDeskError.message}));
    await ticketSDK.createTicket(ticketReq).catch(err => {
      expect(err).to.deep.equal(helpDeskError);
      expect(HTTPServiceSpy).to.have.been.called();
    });
  });
  it('should return success if helpdesk api return success', async () => {
    spy.on(ticketSDK.deviceSDK, 'getToken', data => Promise.resolve("api_key"));
    spy.on(ticketSDK.networkSDK, 'isInternetAvailable', data => Promise.resolve(true));
    const HTTPServiceSpy = spy.on(HTTPService, 'post', data => of({message: helpDeskSuccess.message}));
    let getDeviceIdSpy = spy.on(ticketSDK.systemSDK, 'getDeviceId', data => Promise.resolve('deviceId'));
    let getDeviceInfoSpy = spy.on(ticketSDK.systemSDK, 'getDeviceInfo', data => Promise.resolve({}));
    let getNetworkInfoSpy = spy.on(ticketSDK.systemSDK, 'getNetworkInfo', data => Promise.resolve({}));
    let getCpuLoadSpy = spy.on(ticketSDK.systemSDK, 'getCpuLoad', data => Promise.resolve({}));
    const response = await ticketSDK.createTicket(ticketReq);
    expect(response).to.deep.equal(helpDeskSuccess);
    expect(getDeviceIdSpy).to.have.been.called();
    expect(getDeviceInfoSpy).to.have.been.called();
    expect(getNetworkInfoSpy).to.have.been.called();
    expect(getCpuLoadSpy).to.have.been.called();
    expect(HTTPServiceSpy).to.have.been.called();
  });
})
