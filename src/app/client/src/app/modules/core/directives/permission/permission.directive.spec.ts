import { PermissionService } from './../../services';
import { Directive,ElementRef,Input,OnInit } from '@angular/core';
import { PermissionDirective } from './permission.directive';
import { Subject, of } from 'rxjs';


describe('PermissionDirective', () => {
    let directive: PermissionDirective;

    const elementRefMock :Partial<ElementRef> ={
        nativeElement: { remove: jest.fn() }
    };
	const permissionServiceMock :Partial<PermissionService> ={
        permissionAvailable$: new Subject() as any,
        checkRolesPermissions: jest.fn(() => {
            return true;
        }) as any
    };
    const permissionAvailableSubject = permissionServiceMock.permissionAvailable$;

    beforeAll(() => {
        directive = new PermissionDirective(
            elementRefMock as ElementRef,
			permissionServiceMock as PermissionService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of directive', () => {
        expect(directive).toBeTruthy();
    });

    it('should keep element if permission is valid', () => {
        directive.permission = ['admin'];
        permissionServiceMock.checkRolesPermissions = jest.fn(() => true);
        permissionAvailableSubject.next('success');
        expect(elementRefMock.nativeElement.remove).not.toHaveBeenCalled();
    });

    it('should do nothing if permissionAvailable is undefined', () => {
        permissionAvailableSubject.next(undefined);

        expect(permissionServiceMock.checkRolesPermissions).not.toHaveBeenCalled();
        expect(elementRefMock.nativeElement.remove).not.toHaveBeenCalled();
    });

});