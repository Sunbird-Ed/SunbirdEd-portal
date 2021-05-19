import * as _ from "lodash";
import {
  ITelemetryEvent,
  ITelemetryContextData,
  TelemetryObject,
  IStartEventInput,
  IImpressionEventInput,
  IInteractEventInput,
  IMetricEventInput,
  IShareEventInput,
  IErrorEventInput,
  IEndEventInput,
  ILogEventInput,
  ITelemetryContext,
  IFeedBackEventInput,
  IAuditEventInput,
  IInterruptEventInput,
  ISearchEventData
} from "./ITelemetry";
import * as telemetrySDK from "@project-sunbird/telemetry-sdk";
import SystemSDK from "./../../sdks/SystemSDK";
import { ClassLogger } from '@project-sunbird/logger/decorator';

/* @ClassLogger({
  logLevel: "debug",
  logTime: true
})*/
export class TelemetryHelper {
  /**
   *
   *
   * @private
   * @type {ITelemetryContext}
   * @memberof TelemetryService
   */
  private context: ITelemetryContext;

  /**
   *
   *
   * @private
   * @type {*}
   * @memberof TelemetryService
   */
  private telemetryProvider: any;

  /**
   *
   *
   * @private
   * @type {Boolean}
   * @memberof TelemetryService
   */
  private isInitialized: Boolean = false;

  private systemSDK: SystemSDK;

  /**
   * Creates an instance of TelemetryService.
   * @param {*} telemetryProvider
   * @memberof TelemetryService
   */
  constructor() {
    this.telemetryProvider = telemetrySDK;
    this.systemSDK = new SystemSDK();
  }

  /**
   *
   * Initializes the service
   * @param {ITelemetryContext} context
   * @memberof TelemetryService
   */
  public init(context: ITelemetryContext) {
    this.context = _.cloneDeep(context);
    this.telemetryProvider.initialize(this.context.config);
    this.isInitialized = true;
    console.log("Telemetry Service is Initialized!", this.context);
  }

  /**
   *
   *
   * @param {IStartEventInput} startEventInput
   * @memberof TelemetryService
   */
  public start(startEventInput: IStartEventInput) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(startEventInput);
      this.telemetryProvider.start(
        this.context.config,
        eventData.options.object.id,
        eventData.options.object.ver,
        eventData.edata,
        eventData.options
      );
    }
  }

  /**
   *
   * service method to trigger impression event telemetry
   * @param {IImpressionEventInput} impressionEventInput
   * @memberof TelemetryService
   */
  public impression(impressionEventInput: IImpressionEventInput) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(
        impressionEventInput
      );
      this.telemetryProvider.impression(eventData.edata, eventData.options);
    }
  }
  /**
   *
   * Logs 'interact' telemetry event
   * @param {IInteractEventInput} interactEventInput
   * @memberof TelemetryService
   */
  public interact(interactEventInput: IInteractEventInput) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(interactEventInput);
      this.telemetryProvider.interact(eventData.edata, eventData.options);
    }
  }
  /**
   *
   * Logs 'metrics' telemetry event
   * @param {IInteractEventInput} interactEventInput
   * @memberof TelemetryService
   */
  public metrics(interactEventInput: IMetricEventInput) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(interactEventInput);
      this.telemetryProvider.metrics(eventData.edata, eventData.options);
    }
  }
  /**
   * Logs 'share' telemetry event
   *
   * @param {IShareEventInput} shareEventInput
   * @memberof TelemetryService
   */
  public share(shareEventInput: IShareEventInput) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(shareEventInput);
      this.telemetryProvider.share(eventData.edata, eventData.options);
    }
  }
  /**
   * Logs 'error' telemetry event
   *
   * @param {IErrorEventInput} errorEventInput
   * @memberof TelemetryService
   */
  public error(errorEventInput: IErrorEventInput) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(errorEventInput);
      this.telemetryProvider.error(eventData.edata, eventData.options);
    }
  }

  /**
   * Logs 'end' telemetry event
   *
   * @param {IEndEventInput} endEventInput
   * @memberof TelemetryService
   */
  public end(endEventInput: IEndEventInput) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(endEventInput);
      this.telemetryProvider.end(eventData.edata, eventData.options);
    }
  }

  /**
   * Logs 'log' telemetry event
   *
   * @param {ILogEventInput} logEventInput
   * @memberof TelemetryService
   */
  public log(logEventInput: ILogEventInput) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(logEventInput);
      this.telemetryProvider.log(eventData.edata, eventData.options);
    }
  }

  /**
   * Feedback 'feedback' telemetry event
   *
   * @param {IFeedBackEventInput} IFeedBackEventInput
   * @memberof TelemetryService
   */
  public feedback(feedbackEventInput: IFeedBackEventInput) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(feedbackEventInput);
      this.telemetryProvider.feedback(eventData.edata, eventData.options);
    }
  }

  /**
   * Audit 'audit' telemetry event
   *
   * @param {IAuditEventInput} IFeedBackEventInput
   * @memberof TelemetryService
   */
  public audit(auditEventInput: IAuditEventInput) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(auditEventInput);
      this.telemetryProvider.audit(eventData.edata, eventData.options);
    }
  }

  /**
   * Interrupt 'interrupt' telemetry event
   *
   * @param {IInterruptEvent} IInterruptEvent
   * @memberof TelemetryService
   */
  public interrupt(interruptEventInput: IInterruptEventInput): void {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(interruptEventInput);
      this.telemetryProvider.interrupt(eventData.edata, eventData.options);
    }
  }

  /**
   * Logs 'search' telemetry event
   *
   * @param {ISearchEventData} searchEventInput
   * @memberof TelemetryService
   */
  public search(searchEventInput: ISearchEventData) {
    if (this.isInitialized) {
      const eventData: ITelemetryEvent = this.getEventData(searchEventInput);
      this.telemetryProvider.search(eventData.edata, eventData.options);
    }
  }

  /**
   *
   *
   * @private
   * @param {*} eventInput
   * @returns
   * @memberof TelemetryService
   */
  private getEventData(eventInput: any): ITelemetryEvent {
    return {
      edata: eventInput.edata,
      options: {
        context: this.getEventContext(eventInput),
        object: this.getEventObject(eventInput),
        tags: _.compact(this.context.userOrgDetails.organisationIds)
      }
    };
  }

  /**
   *
   *
   * @private
   * @param {*} eventInput
   * @returns
   * @memberof TelemetryService
   */
  private getEventObject(eventInput: any) {
    if (eventInput.object) {
      const eventObjectData: TelemetryObject = {
        id: eventInput.object.id || "",
        type: eventInput.object.type || "",
        ver: eventInput.object.ver || "",
        rollup: eventInput.object.rollup || {}
      };
      return eventObjectData;
    } else {
      // telemetry.min.js will take last sent object is not sent.
      return {};
    }
  }

  /**
   *
   *
   * @private
   * @param {*} eventInput
   * @returns
   * @memberof TelemetryService
   */
  private getEventContext(eventInput: any): ITelemetryContextData {
    return {
      channel: eventInput.edata.channel || this.context.config.channel,
      pdata: eventInput.edata.pdata || this.context.config.pdata,
      env: eventInput.context.env || this.context.config.env,
      sid: eventInput.sid || this.context.config.sid,
      uid: this.context.config.uid,
      cdata: eventInput.context.cdata || [],
      rollup: this.getRollUpData(this.context.userOrgDetails.organisationIds)
    };
  }

  /**
   *
   *
   * @private
   * @param {Array<string>} [data=[]]
   * @returns
   * @memberof TelemetryService
   */
  public getRollUpData(data: Array<string> = []) {
    const rollUp = {};
    data.forEach((element, index) => (rollUp["l" + (index + 1)] = element));
    return rollUp;
  }
}
