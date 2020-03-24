
import { Injectable, Optional, OnDestroy } from '@angular/core';
import * as opentracing from 'opentracing';
import * as Actions from './actions.json';
 
export class TracerMock extends opentracing.Tracer {
    private _action:string = "";
    private _span:any;

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
    tracer:opentracing.MockTracer;

    /**
	 * Span object for specific action. 
     * One trace can have multiple span objects
	*/
    _currentSpan:opentracing.Span;

    // To hold current span name
    _currentAction:string;


    public ACTIONS: any;

    constructor() {
        // this = new TraceServiceConfig()
        console.log('== TraceService instance created.');    
        this.ACTIONS = (Actions as any).default;
    }

    /**
	 * Start new trace
	*/
    startTrace(action) {
        if(action) {
            this.tracer = new opentracing.MockTracer();
            this._currentSpan = this.tracer.startSpan(action);
            console.log("==> Trace Start", this.tracer);
            console.log("==> Actions", this.ACTIONS);
        }
    }

    /**
	 * Start new span for the new workflow/api
     * the span can be child of parent span
	*/
    startSpan(action?: string) {
        // if(this._currentSpan) {
        //     this._currentSpan.finish();
        // }
        let spanName = action ? action : (this._currentAction ? this._currentAction : undefined) ;
        if(spanName)
            this._currentSpan = this.tracer.startSpan(action);
    }

    /**
     * Set current span name by component
     * When the service/API is being called by the component, then use this span name to start new trance spna object
     */
    setSpanAction(actionName){
        this._currentAction = actionName;
    }
     

    /**
	 * End span
	*/
    endSpan() {
        console.log("==> Trace before End Span", this._currentSpan);
        if(this._currentSpan) this._currentSpan.finish();
        
    }

    /**
	 * End span
	*/
    endTrace() {
        console.log("==> Trace before End Trace", this.tracer);
        if(this._currentSpan) this._currentSpan.finish();
        
    }

    get trace() {
        return this.tracer;
    }

    get currentSpan() {
        return this._currentSpan;
    }
}
