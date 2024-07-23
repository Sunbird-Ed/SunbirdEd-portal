import { ListAllReportsComponent } from './list-all-reports.component';
import { UserService, TncService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationHelperService, LayoutService, ResourceService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { ReportService } from '../../services';
import { ElementRef } from '@angular/core';


describe('ListAllReportsComponent', () => {
    let component: ListAllReportsComponent;
    const mockResourceService: Partial<ResourceService> = {}
    const mockUserService: Partial<UserService> = {
        userData$: of({
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'sample-root-id',
                rootOrg: {},
                hashTagIds: ['id'],

            } as any,
            subscribe: jest.fn()
        }) as any,
    };
    const mockReportService: Partial<ReportService> = {
        isAuthenticated: jest.fn().mockReturnValue(of(true)),
        isUserReportAdmin: jest.fn().mockReturnValue(true),
        isUserSuperAdmin: jest.fn().mockReturnValue(false),
        listAllReports: jest.fn().mockReturnValue(of({ reports: [{ report_type: 'Report' }, { report_type: 'Dataset' }] })),
        getMaterializedChildRows: jest.fn(),
        getFlattenedReports: jest.fn()
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            data: {
                telemetry: {
                    env: 'test-env',
                    pageid: 'test-pageid'
                },
                roles: ['admin']
            }
        } as any,
    };
    const mockRouter: Partial<Router> = {
        navigate: jest.fn().mockResolvedValue(true),
        url: '/test-url'
    };
    const mockNavigationHelperService: Partial<NavigationHelperService> = {
        getPageLoadTime: jest.fn().mockReturnValue(500)
    };
    const mockTelemetryService: Partial<TelemetryService> = {
        interact: jest.fn(),
    };
    const mockTncService: Partial<TncService> = {
        getReportViewerTnc: jest.fn().mockReturnValue(of({
            result: {
                response: {
                    value: '{  "latestVersion": "1.0","1.0": "abc","abc": {"url": "http://example.com"}}'
                }
            }
        }))
    };
    const mockLocation: Partial<Location> = {
        back: jest.fn()
    };
    const mockLayoutService: Partial<LayoutService> = {
        initlayoutConfig: jest.fn(),
        switchableLayout: jest.fn().mockReturnValue(of({ layout: 'mockLayout' }))
    };

    beforeEach(() => {
        component = new ListAllReportsComponent(
            mockResourceService as ResourceService,
            mockReportService as ReportService,
            mockActivatedRoute as ActivatedRoute,
            mockRouter as Router,
            mockUserService as UserService,
            mockNavigationHelperService as NavigationHelperService,
            mockTelemetryService as TelemetryService,
            mockLayoutService as LayoutService,
            mockTncService as TncService,
            mockLocation as Location,

        )
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set userProfile and call getReportViewerTncPolicy if user and userProfile exist', () => {
        const mockUser = {
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'sample-root-id',
                rootOrg: {},
                hashTagIds: ['id'],

            } as any,
        };
        const getReportViewerTncPolicySpy = jest.spyOn(component, 'getReportViewerTncPolicy');
        component.ngOnInit();
        expect(component.userProfile).toEqual(mockUser.userProfile);
        expect(getReportViewerTncPolicySpy).toHaveBeenCalled();
    });

    it('should set reportsList$ based on authentication and user role', () => {
        mockReportService.isAuthenticated = jest.fn().mockReturnValue(of(true));
        mockReportService.isUserReportAdmin = jest.fn().mockReturnValue(true);
        const mockReports = [{ id: 1, name: 'Report 1' }, { id: 2, name: 'Report 2' }];
        component.ngOnInit();
        expect(component.reportsList$).toBeDefined();
        component.reportsList$.subscribe(reports => {
            expect(reports).toEqual(mockReports);
        });
        expect(mockReportService.isAuthenticated).toHaveBeenCalledWith(['admin']);
        expect(mockReportService.isUserReportAdmin).toHaveBeenCalled();
        // expect(component.getReportsList).toHaveBeenCalledWith(true);
    });


    it('should navigate to the report with reportId and optional hash', () => {
        // Arrange
        const reportId = 'testReportId';
        const hash = 'testHash';
        const materialize = true;
        // Act
        component.rowClickEventHandler(reportId, hash, materialize);
        // Assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(
            ['/dashBoard/reports', reportId, hash],
            { queryParams: { materialize } }
        );
    });

    it('should navigate to the report without optional hash', () => {
        // Arrange
        const reportId = 'testReportId';
        // Act
        component.rowClickEventHandler(reportId);
        // Assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(
            ['/dashBoard/reports', reportId],
            { queryParams: {} }
        );
    });

    it('should set reportViewerTncVersion and reportViewerTncUrl', () => {
        component.getReportViewerTncPolicy();
        expect(component.reportViewerTncVersion).toEqual('1.0');
        expect(component.reportViewerTncUrl).toEqual(undefined);
    });

    it('should set showTncPopup to true if reportViewerTncObj is not present in userProfile', () => {
        // Arrange
        component.userProfile = { allTncAccepted: {} };
        // Act
        component.showReportViewerTncForFirstUser();
        // Assert
        expect(component.showTncPopup).toBeTruthy();
    });

    it('should not set showTncPopup to true if reportViewerTncObj is present in userProfile', () => {
        // Arrange
        component.userProfile = { allTncAccepted: { reportViewerTnc: true } };
        // Act
        component.showReportViewerTncForFirstUser();
        // Assert
        expect(component.showTncPopup).toBeFalsy();
    });

    it('should call location.back() when goBack() is called', () => {
        component.goBack();
        expect(mockLocation.back).toHaveBeenCalled();
    });

    it('should update layoutConfiguration based on switchableLayout observable', () => {
        component.initLayout();
        expect(component.layoutConfiguration).toBe('mockLayout');
    });


    it('should return the telemetry impression object', () => {
        // Arrange
        const type = 'test-type';
        const cdata = [{ id: 'test-id', type: 'test-type' }];
        // Act
        const telemetryImpression = component.getTelemetryImpression({ type, cdata });
        // Assert
        expect(telemetryImpression).toEqual({
            context: {
                env: 'test-env',
                cdata: [{ id: 'test-id', type: 'test-type' }]
            },
            object: {
                id: undefined,
                type: 'user',
                ver: '1.0'
            },
            edata: {
                type: 'test-type',
                pageid: 'test-pageid',
                uri: '/test-url',
                duration: 500
            }
        });
    });

    it('should return correct reports count for different scenarios', () => {
        const reports = [
            { id: 1, status: 'draft' },
            { id: 2, status: 'live' },
            { id: 3, status: 'draft' },
            { id: 4, status: 'archived' }
        ];
        const draftReportsCount = component['getReportsCount']({ reports, status: 'draft' });
        const liveReportsCount = component['getReportsCount']({ reports, status: 'live' });
        const archivedReportsCount = component['getReportsCount']({ reports, status: 'archived' });
        expect(draftReportsCount).toBe(2);
        expect(liveReportsCount).toBe(1);
        expect(archivedReportsCount).toBe(1);
    });


    it('should return 0 when reports array is empty', () => {
        const reports = [];
        const count = component['getReportsCount']({ reports });
        expect(count).toBe(0);
    });

    it('should return correct count when reports array contains elements with specified status', () => {
        const reports = [
            { id: 1, status: 'draft' },
            { id: 2, status: 'live' },
            { id: 3, status: 'draft' },
            { id: 4, status: 'archived' }
        ];
        const countDraft = component['getReportsCount']({ reports, status: 'draft' });
        const countLive = component['getReportsCount']({ reports, status: 'live' });
        const countArchived = component['getReportsCount']({ reports, status: 'archived' });
        expect(countDraft).toBe(2);
        expect(countLive).toBe(1);
        expect(countArchived).toBe(1);
    });

    it('should return 0 when reports array does not contain elements with specified status', () => {
        const reports = [
            { id: 1, status: 'draft' },
            { id: 2, status: 'draft' },
            { id: 3, status: 'draft' }
        ];
        const count = component['getReportsCount']({ reports, status: 'live' });
        expect(count).toBe(0);
    });

    it('should return correct count when status is not specified', () => {
        const reports = [
            { id: 1, status: 'draft' },
        ];
        const count = component['getReportsCount']({ reports });
        expect(count).toBe(reports.length);
    });

    it('should prepare table when inputTag is set', () => {
        const mockElementRef: ElementRef = {
            nativeElement: document.createElement('div')
        };
        const mockReports = [{ id: 1, name: 'Report 1' }, { id: 2, name: 'Report 2' }];
        component.reports = [{ id: 1, name: "Report 1" }]
        component.prepareTable = jest.fn();
        component.inputTag = mockElementRef;
        expect(component.prepareTable).toHaveBeenCalledWith(mockElementRef.nativeElement, mockReports[0]);
    });


    it('should not prepare table when inputTag is null', () => {
        component.prepareTable = jest.fn();
        component.inputTag = null;
        expect(component.prepareTable).not.toHaveBeenCalled();
    });

    it('should not prepare dataset table when datasetTable is null', () => {
        mockReportService.isUserReportAdmin = jest.fn().mockReturnValue(false);
        component.prepareTable = jest.fn();
        component.datasetTable = null;
        expect(component.prepareTable).not.toHaveBeenCalled();
    });

    it('should render tags correctly when data is an array', () => {
        // Arrange
        const data = ['tag1', 'tag2', 'tag3'];
        // Act
        const renderedTags = component['renderTags'](data);
        // Assert
        const expectedHtml = `<div class="sb-filter-label" tabindex="0"><div class="d-inline-flex m-0"><span class="sb-label-name sb-label-table sb-label-primary-100 mr-5 px-8 py-4" tabindex="0">Tag 1</span> <span class="sb-label-name sb-label-table sb-label-primary-100 mr-5 px-8 py-4" tabindex="0">Tag 2</span> <span class="sb-label-name sb-label-table sb-label-primary-100 mr-5 px-8 py-4" tabindex="0">Tag 3</span></div></div>`
        expect(renderedTags).toEqual(expectedHtml);
    });

    it('should render single tag correctly when data is not an array', () => {
        // Arrange
        const data = 'tag';
        // Act
        const renderedTags = component['renderTags'](data);
        // Assert
        const expectedHtml = 'Tag';
        expect(renderedTags).toEqual(expectedHtml);
    });

    it('should return telemetry interact data with default id when only type is provided', () => {
        // Arrange
        const type = 'some-type';
        // Act
        const telemetryData = component.setTelemetryInteractEdata({ type });
        // Assert
        expect(telemetryData).toEqual({
            id: 'reports-list',
            type,
            pageid: 'test-pageid'
        });
    });

    it('should return telemetry interact data with provided id and type', () => {
        // Arrange
        const type = 'another-type';
        const id = 'custom-id';
        // Act
        const telemetryData = component.setTelemetryInteractEdata({ type, id });
        // Assert
        expect(telemetryData).toEqual({
            id,
            type,
            pageid: 'test-pageid'
        });
    });


    it('should log telemetry correctly', () => {
        // Arrange
        const type = 'testType';
        const cdata = [{ id: 'testId', type: 'testType' }];
        const id = 'testId';
        // Act
        component['logTelemetry']({ type, cdata, id });
        // Assert
        expect(mockTelemetryService.interact).toHaveBeenCalledWith({
            context: {
                env: 'test-env',
                cdata
            },
            edata: Object({
                id: 'reports-list',
                type: 'testType',
                pageid: 'test-pageid'
            }),
            object: Object({
                type: 'Report',
                ver: "1.0",
                id: "testId",
                rollup: Object({}),
            })
        });
    });
    it('should return materialized child rows if user is super admin', () => {
        // Arrange
        mockReportService.isUserSuperAdmin = jest.fn().mockReturnValue(true);
        const reports = [{ id: 1 }, { id: 2 }];
        // Act
        const result = component['filterReportsBasedOnRoles'](reports);
        // Assert
        expect(result).toEqual(mockReportService.getMaterializedChildRows(reports));
    });

});