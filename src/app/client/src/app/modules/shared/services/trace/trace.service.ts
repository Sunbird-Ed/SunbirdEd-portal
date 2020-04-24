
import { Injectable, Optional, OnDestroy } from '@angular/core';
import * as opentracing from 'opentracing';
import * as Actions from './actions.json';
import * as _ from 'lodash-es';
import { TelemetryService } from '@sunbird/telemetry';

export class TracerMock extends opentracing.Tracer {
    private _action = '';
    private _span: any;

    constructor() {
        super();
    }

  }

@Injectable({
    providedIn: 'root'
})
export class TraceService {

    /**
	 * Single trace object for the action
     * Only 1 trace object created for 1 workflow.
     * Any new worflow starts, end the current trace & create the new trace
	*/
    tracer: opentracing.MockTracer;


    /**
	 * Span object for specific action.
     * Any new workflow starts, end the current parent span & create the new parent span
	*/
    _currentParentSpan: opentracing.Span;

    /**
	 * Span object for specific action.
     * One trace can have multiple span objects
     * create a childSpan reference to the parent span
	*/
    _currentSpan: opentracing.Span;

    // To hold current span name
    _currentAction: string;

    _tags: any = [];


    public ACTIONS: any;
    // tslint:disable-next-line:member-ordering
    static singletonInstance: TraceService;

    constructor(private telemetryService: TelemetryService) {
        // this = new TraceServiceConfig()
        console.log('== TraceService instance created.');
        this.ACTIONS = (Actions as any).default;
        if (!TraceService.singletonInstance) {
            TraceService.singletonInstance = this;
          }
        return TraceService.singletonInstance;
    }

    /**
	 * Start new trace
	*/
    startTrace(action) {
        if (action) {
            this.tracer = new opentracing.MockTracer();
            this._currentParentSpan = this.tracer.startSpan(action);
            console.log('==> Trace Start', this.tracer);
            console.log('==> Actions', this.ACTIONS);
        }
    }

    /**
	 * Start new span for the new workflow/api
     * the span can be child of parent span
	*/
    startSpan(action?: string) {

        if (_.isEmpty(this._currentParentSpan)) {
            this.startTrace(action);
        }

        if (this._currentSpan) {
            this.endSpan();
        }

        const spanName = this._currentAction ? this._currentAction : (action ? action : undefined) ;
        if (spanName) {
            this._currentSpan = this.tracer.startSpan(spanName);
            // return this._currentSpan;
        }
    }

    /**
     * Set current span name by component
     * When the service/API is being called by the component, then use this span name to start new trance spna object
     */
    setSpanAction(actionName) {
        this._currentAction = actionName;
    }

    setTag(keyValueMap: { [key: string]: any }) {
        this._tags.push(keyValueMap);
    }

    /**
	 * End span
	*/
    endSpan() {
        // console.log('==> Trace before End Span', this._currentSpan);
        if (this._currentSpan) {
            this._currentSpan.finish();
            this.logTelemetry(this._currentParentSpan, this._currentSpan);
            this.endTrace();
            this.clearSpan();
        }
    }

    /**
     * Discard any buffered data.
    */

    clearSpan() {
        this._currentSpan = undefined;
        this._currentAction = undefined;
    }


    /**
	 * End span
    */
    endTrace() {
        // console.log('==> Trace before End Trace', this.tracer);
        const isLastChild = this.findLastChild(this._currentParentSpan, this._currentSpan);
        const currentSpan: any = this._currentSpan;
        const currentParentSpan: any = this._currentParentSpan;
        if (isLastChild) {
            this._currentParentSpan.finish();
            this.logTelemetry(this._currentParentSpan);
            this.clearTrace();
        } else if (currentSpan._operationName === currentParentSpan._operationName) {
            this._currentParentSpan.finish();
            this.logTelemetry(this._currentParentSpan);
            this.clearTrace();
        }
    }

    /**
     * Discard any buffered data.
     */
    clearTrace() {
        this._currentParentSpan = undefined;
        this.tracer.clear();
        this._tags = [];
    }

    findLastChild (parent, child) {
        let isLastChild = false;
        _.forIn(this.ACTIONS, (value, key) => {
            if (value.id === parent._operationName) {
                isLastChild = _.isEqual(_.findLastKey(value.chidren), child._operationName);
            }
        });
        return isLastChild;
    }

    logTelemetry(currentParentSpan, currentSpan?) {
        if (!currentSpan) {
            currentSpan = currentParentSpan;
        }

        const telemetryTraceData = {
          context: {
            env: 'trace'
          },
          edata: {
            id : currentParentSpan._uuid,
            name : currentParentSpan._operationName,
            span : {
                traceID: currentParentSpan._uuid,
                spanID: currentSpan._uuid,
                // "flags": 1,
                operationName : currentSpan._operationName,
                references: [],
                startTime: currentSpan._startMs,
                duration: currentSpan.durationMs(),
                context: this._tags,
                tags: this._tags,
                logs: [],
                processID: '',
                warnings: ''
              }
          }
        };
        console.log('traceData', JSON.stringify(telemetryTraceData));
        this.telemetryService.trace(telemetryTraceData);
    }

    get trace() {
        return this.tracer;
    }

    get currentSpan() {
        return this._currentSpan;
    }

    get currentParentSpan() {
        return this._currentParentSpan;
    }
}
