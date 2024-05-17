
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/
import { CourseProgressService } from '../courseProgress/course-progress.service';
import { _ } from 'lodash-es';
import { AssessmentScoreService } from './assessment-score.service';
import { of } from 'rxjs';

describe('AssessmentScoreService', () => {
    let service: AssessmentScoreService;

    const courseProgressService: Partial<CourseProgressService> = {
        sendAssessment: jest.fn().mockReturnValue(of())
    };

    beforeAll(() => {
        service = new AssessmentScoreService(
            courseProgressService as CourseProgressService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of service', () => {
        expect(service).toBeTruthy();
    });

    it('should process telemetry events if initialized', () => {
        service['initialized'] = true;
        const event = {
            detail: {
                telemetryData: {
                    eid: 'END',
                    object: { id: 'sample-content-id' }
                }
            }
        };
        service.receiveTelemetryEvents(event)
        expect(service['initialized']).toBeTruthy()
    })

    it('should not process telemetry events if not initialized', () => {
        service['initialized'] = false;
        const event = {
            detail: {
                telemetryData: {
                    eid: 'END',
                    object: { id: 'sample-content-id' }
                }
            }
        };
        service.receiveTelemetryEvents(event)
        expect(service['initialized']).toBeFalsy();
    })

    describe('handleReviewButtonClickEvent', () => {
        it('should clear assess events', () => {
            service['_assessEvents'] = ['event1', 'event2', 'event3'];
            service.handleReviewButtonClickEvent();
            expect(service['_assessEvents']).toEqual([]);
        });
    });
    it('initilize the assessment service', () => {
        let batchDetails = {
            batchId: 1234
        }
        let courseDetails = {
            courseId: 1234
        }
        let contentDetails = {
            contentId: 1234
        }
        service['_batchDetails'] = batchDetails
        service['_courseDetails'] = courseDetails
        service['_contentDetails'] = contentDetails

        service.init({ batchDetails, courseDetails, contentDetails });
        service['checkContentForAssessment']
    })

    it('handles submit button clicked in course player', () => {
        const clicked = true;
        service['_startEvent'] = true;
        service['initialized'] = true;
        service['processAssessEvents'] = jest.fn();
        service.handleSubmitButtonClickEvent(clicked);
        expect(service['processAssessEvents']).toHaveBeenCalled();

    })

    it('process the telemetry Events for eid as END', () => {
        const event = {
            detail: {
                telemetryData: {
                    eid: 'END',
                    edata: "edata",
                    object: { id: 'sample-content-id' }
                }
            }
        };
        const eventData = event.detail.telemetryData;
        const eid = eventData.eid;
        const edata = eventData.edata

        service['processTelemetryEvents'](event)
    })

    it('process the telemetry Events for eid as START', () => {
        const event = {
            detail: {
                telemetryData: {
                    eid: 'START',
                    edata: "edata",
                    ets: 'ets',
                    actor: {
                        id: '123'
                    },
                    object: { id: 'sample-content-id' }
                }
            }
        };
        const eventData = event.detail.telemetryData;
        const eid = eventData.eid;
        const edata = eventData.edata
        service['_startEvent'] = eventData
        service['._assessmentTs'] = eventData.ets
        service['_userId'] = eventData.actor.id
        service['_assessEvents'] = []

        service['processTelemetryEvents'](event)
    })

    it('process the telemetry Events for eid as INTERACT', () => {
        const event = {
            detail: {
                telemetryData: {
                    eid: 'INTERACT',
                    edata: {
                        id: 'Review_button'
                    },
                    ets: 'ets',
                    actor: {
                        id: '123'
                    },
                    object: { id: 'sample-content-id' }
                }
            }
        };
        service['_assessEvents'] = []

        service['processTelemetryEvents'](event)
    })

    it('process the telemetry Events for eid as ASSESS', () => {
        const event = {
            detail: {
                telemetryData: {
                    eid: 'ASSESS',
                    edata: {
                        id: 'Review_button'
                    },
                    ets: 'ets',
                    actor: {
                        id: '123'
                    },
                    object: { id: 'sample-content-id' }
                }
            }
        };
        service['_assessEvents'] = [event]
        service['processTelemetryEvents'](event)
    })

    it('checks if the course has assessment or not', () => {
        let batchDetails = {
            batchId: 1234,
            courseId: 'c123'
        }
        let courseDetails = {
            courseId: 1234
        }
        let contentDetails = {
            identifier: 1234
        }
        service['_batchDetails'] = batchDetails
        service['_courseDetails'] = courseDetails
        service['_contentDetails'] = contentDetails
        service['initialized'] = true
        service['checkContentForAssessment']()
        expect(service['_batchDetails']).toBeDefined();
        expect(service['_courseDetails']).toBeDefined();
        expect(service['_contentDetails']).toBeDefined();
        expect(service['initialized']).toBeTruthy();
    })
    describe('updateAssessmentScore', () => {
        it('should call courseProgressService.sendAssessment with the correct arguments', () => {
            const mockRequest = {};
            service['updateAssessmentScore'](mockRequest);
            expect(courseProgressService.sendAssessment).toHaveBeenCalledWith({ requestBody: mockRequest, methodType: 'PATCH' });

        });
    });

    describe('prepareRequestObject', () => {
        it('should construct the request object with the correct properties', () => {
            const attemptId = 'attempt123';
            const request = service['prepareRequestObject'](attemptId);
            expect(request).toEqual({
                request: {
                    userId: '123',
                    contents: [{
                        contentId: 1234,
                        batchId: 1234,
                        status: 2,
                        courseId: 'c123',
                        lastAccessTime: expect.any(String)
                    }],
                    assessments: [{
                        assessmentTs: 'ets',
                        batchId: 1234,
                        courseId: 'c123',
                        userId: "123",
                        attemptId: 'attempt123',
                        contentId: 1234,
                        events: [
                            {
                                detail: {
                                    telemetryData: {
                                        actor: {
                                            id: "123",
                                        },
                                        edata: {
                                            id: "Review_button",
                                        },
                                        eid: "ASSESS",
                                        ets: "ets",
                                        object: {
                                            "id": "sample-content-id",
                                        },
                                    },
                                },
                            },
                            {
                                actor: {
                                    id: "123",
                                },
                                edata: {
                                    id: "Review_button",
                                },
                                eid: "ASSESS",
                                ets: "ets",
                                object: {
                                    id: "sample-content-id",
                                },
                            },
                        ]
                    }]
                }

            });
        })
    });
});