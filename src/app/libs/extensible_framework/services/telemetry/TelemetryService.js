"use strict";
/*
*
* @author Sunil A S<sunils@ilimi.in>
*
*/
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const http_service_1 = require("../http-service");
/**
 * Telemetry Service to log telemetry v3 events
 *
 * @class TelemetryService
 */
class TelemetryService {
    /**
     *
     *
     * @param {ITelemetry} config
     * @param {*} provider
     * @memberof TelemetryService
     */
    constructor(config, provider) {
        this.provider = provider;
        this.config = _.cloneDeep(config);
        config.dispatcher = config.dispatcher ? this.getDispatcher(config.dispatcher) : this.getDispatcher('console');
        provider.initialize(config);
        console.log('Telemetry Service is initialized!');
    }
    /**
     *
     *
     * @param {IEventData} data
     * @memberof TelemetryService
     */
    log(data) {
        const eventData = this.getEventData(data);
        this.provider.log(eventData.edata, eventData.options);
    }
    /**
     *
     *
     * @param {IEventData} data
     * @memberof TelemetryService
     */
    audit(data) {
        const eventData = this.getEventData(data);
        this.provider.audit(eventData.edata, eventData.options);
    }
    /**
     *
     *
     * @param {IEventData} data
     * @memberof TelemetryService
     */
    error(data) {
        const eventData = this.getEventData(data);
        this.provider.error(eventData.edata, eventData.options);
    }
    /**
     *
     *
     * @param {IEventData} data
     * @memberof TelemetryService
     */
    search(data) {
        const eventData = this.getEventData(data);
        this.provider.search(eventData.edata, eventData.options);
    }
    /**
     *
     *
     * @param {IEventData} data
     * @memberof TelemetryService
     */
    start(data) {
        const eventData = this.getEventData(data);
        this.provider.start(this.config, eventData.options.object.id, eventData.options.object.ver, eventData.edata, eventData.options);
    }
    /**
     *
     *
     * @param {IEventData} data
     * @memberof TelemetryService
     */
    end(data) {
        const eventData = this.getEventData(data);
        this.provider.end(eventData.edata, eventData.options);
    }
    getRollUpData(data = []) {
        const rollUp = {};
        data.forEach((element, index) => rollUp['l' + index] = element);
        return rollUp;
    }
    getEventData(event) {
        return {
            edata: event.edata,
            options: {
                context: this.getEventContext(event),
                object: this.getEventObject(event),
                // TODO: get tags data from event
                tags: []
            }
        };
    }
    getEventObject(event) {
        return {
            id: event.object.id || '',
            type: event.object.type || '',
            ver: event.object.ver || '',
            rollup: event.object.rollup || {}
        };
    }
    getEventContext(event) {
        return {
            channel: _.get(event, 'edata.channel') || this.config.channel,
            pdata: _.get(event, 'edata.pdata') || this.config.pdata,
            env: _.get(event, 'env') || this.config.env,
            sid: _.get(event, 'sid') || this.config.sid,
            uid: this.config.uid,
            cdata: _.get(event, 'cdata') || [],
            // TODO: get rollup data from event
            rollup: this.getRollUpData()
        };
    }
    getDispatcher(type) {
        let dispatchers = {
            'console': {
                dispatch: event => {
                    console.log('------TELEMETRY--LOG---------');
                    console.log('EVENT: ', JSON.stringify(event));
                }
            },
            'http': {
                dispatch: event => {
                    // TODO: config object for http service
                    http_service_1.HTTPService.post(this.config.endpoint, JSON.stringify(event)).subscribe((result) => {
                        // console.log(result)
                    });
                }
            }
        };
        return dispatchers[type];
    }
}
exports.TelemetryService = TelemetryService;
