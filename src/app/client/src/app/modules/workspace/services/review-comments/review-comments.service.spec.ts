import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { ReviewCommentsService } from './review-comments.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@sunbird/shared';
import { ExtPluginService } from '@sunbird/core';

 describe('ReviewCommentsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, SharedModule.forRoot()],
        providers: [ReviewCommentsService, ConfigService]
        });
    });
    it('should call create comment api', inject([ReviewCommentsService], (service: ReviewCommentsService) => {
        const extPluginService = TestBed.get(ExtPluginService);
        spyOn(extPluginService, 'post').and.callFake(() => 'true');
        service.createComment({});
        expect(service.extPluginService.post).toHaveBeenCalled();
    }));
    it('should call get comment api', inject([ReviewCommentsService], (service: ReviewCommentsService) => {
        const extPluginService = TestBed.get(ExtPluginService);
        spyOn(extPluginService, 'post').and.callFake(() => 'true');
        service.getComments({});
        expect(service.extPluginService.post).toHaveBeenCalled();
    }));
    it('should call delete comment api', inject([ReviewCommentsService], (service: ReviewCommentsService) => {
        const extPluginService = TestBed.get(ExtPluginService);
        spyOn(extPluginService, 'delete').and.callFake(() => 'true');
        service.deleteComment({});
        expect(service.extPluginService.delete).toHaveBeenCalled();
    }));
 });
