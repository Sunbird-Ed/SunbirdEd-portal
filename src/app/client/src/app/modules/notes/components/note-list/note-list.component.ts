
import { takeUntil } from 'rxjs/operators';
import { ResourceService, ToasterService, FilterPipe, ServerResponse, RouterNavigationService } from '@sunbird/shared';
import { NotesService } from '../../services';
import { UserService, ContentService } from '@sunbird/core';
import { Component, OnInit, Pipe, PipeTransform, Input, OnDestroy } from '@angular/core';
import { InlineEditorComponent } from '../inline-editor/inline-editor.component';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import { INoteData, IdDetails } from '@sunbird/notes';
import * as _ from 'lodash';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';

import { Subject } from 'rxjs';
/**
 * This component contains 2 sub components
 * 1)Inline editor: Provides an editor to create and update notes.
 * 2)DeleteNote: To delete an existing note.
 */

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styles: [' ::ng-deep .notedec ul li { list-style-type: disc; margin-bottom: 10px; }']
})
export class NoteListComponent implements OnInit, OnDestroy {
  /**
   * This variable holds the content and course id.
   */
  @Input() ids: IdDetails;
  /**
   * This variable helps in displaying and hiding page loader.
   * By default it is assigned a value of 'true'. This ensures that
   * the page loader is displayed the first time the page is loaded.
   */
  showLoader = true;
  /**
   * Helps in displaying and hiding create editor.
   */
  showCreateEditor = false;
  /**
   * Helps in displaying and hiding update editor.
   */
  showUpdateEditor = false;

  /**
   * The notesList array holds the entire list of existing notes. Each
   * note is saved as an object.
   */
  notesList: Array<INoteData> = [];

  /**
   *Stores the details of a note selected by the user.
   */
  selectedNote: INoteData;
  /**
   * Stores the index of the selected note in notesList array.
   */
  selectedIndex = 0;
  /**
   * This variable stores the search input from the search bar.
   */
  searchData: string;
  /**
   * This variable helps in displaying and dismissing the delete modal.
   */
  showDelete = false;
  /**
   * User id from user service.
   */
  userId: string;
  /**
   * course id details
   */
  courseId: string;
  /**
   * content id details
   */
  contentId: string;
  batchId: string;
  /**
   * To display toast message(if any) after each API call.
   */
  private toasterService: ToasterService;
  /**
   * Reference of notes service.
   */
  noteService: NotesService;
  /**
   * Reference of user service.
   */
  userService: UserService;
  /**
   * Reference of content service.
   */
  contentService: ContentService;
  /**
   * Reference of resource service.
   */
  resourceService: ResourceService;
  /**
   * Reference of modal service.
   */
  modalService: SuiModalService;
  /**
   * Reference of Router.
   */
  route: Router;
  /**
   * Reference of ActivatedRoute.
   */
  activatedRoute: ActivatedRoute;
  /**
   * Reference of Router Navigation Service
   */
  routerNavigationService: RouterNavigationService;
  /**
  * inviewLogs
  */
  inviewLogs = [];
  /**
  * telemetryImpression
  */
  telemetryImpression: IImpressionEventInput;
  public unsubscribe$ = new Subject<void>();

  /**
   * The constructor - Constructor for Note List Component.
   *
   * @param {ToasterService} toasterService Reference of ToasterService.
   * @param {UserService} userService Reference of UserService.
   * @param {ContentService} contentService Reference of ContentService.
   * @param {ResourceService} resourceService Reference of ResourceService.
   * @param {SuiModalService} modalService Reference of SuiModalService.
   * @param {NotesService} noteService Reference of NotesService.
   * @param {Router} route Reference of Router.
   * @param {ActivatedRouter} activatedRoute Reference of ActivatedRouter.
   */

  constructor(noteService: NotesService,
    userService: UserService,
    contentService: ContentService,
    resourceService: ResourceService,
    modalService: SuiModalService,
    toasterService: ToasterService,
    route: Router,
    activatedRoute: ActivatedRoute) {
    this.toasterService = toasterService;
    this.userService = userService;
    this.noteService = noteService;
    this.contentService = contentService;
    this.resourceService = resourceService;
    this.modalService = modalService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    // this.route.onSameUrlNavigation = 'reload';
  }
  /**
   * To initialize notesList and showDelete.
   * Listens to updateNotesListData event as well.
   */
  ngOnInit() {
    /**
     * Initializing notesList array
     */
    this.userId = this.userService.userid;
    this.activatedRoute.params.subscribe(params => {
      this.contentId = params.contentId;
      this.courseId = params.courseId;
      this.batchId = params.batchId;
    });
    this.getAllNotes();
    let cdataId = '';
    let cdataType = '';
    if (this.activatedRoute.snapshot.params.courseId) {
      cdataId = this.activatedRoute.snapshot.params.courseId;
      cdataType = 'course';
    } else if (this.activatedRoute.snapshot.params.contentId) {
      cdataId = this.activatedRoute.snapshot.params.contentId;
      cdataType = 'content';
    } else {
      cdataId = this.activatedRoute.snapshot.params.contentId;
      cdataType = 'collection';
    }
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [
          {
            id: cdataId,
            type: cdataType
          }
        ]
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.route.url
      }
    };
  }

  /**
   * This method calls the search API.
   */
  public getAllNotes() {
    const requestBody = {
      request: {
        filters: {
          userId: this.userId,
          courseId: this.courseId,
          contentId: this.contentId
        },
        sort_by: {
          updatedDate: 'desc'
        }
      }
    };

    if (requestBody.request.filters.contentId || requestBody.request.filters.courseId) {
      this.noteService.search(requestBody).pipe(
        takeUntil(this.unsubscribe$))
        .subscribe(
          (apiResponse: ServerResponse) => {
            this.showLoader = false;
            this.notesList = apiResponse.result.response.note;
            this.selectedNote = this.notesList[0];
          },
          (err) => {
            this.showLoader = false;
            this.toasterService.error(this.resourceService.messages.fmsg.m0033);
          }
        );
    }
  }

  /**
   * This method sets the value of a selected note to the variable 'selectedNote'
   * and passes it on to notesService.
   * @param note The selected note from list view.
   * @param index The index of the selectedNote.
   */
  public setSelectedNote(note, index) {
    this.selectedIndex = index;
    this.selectedNote = note;
  }

  /**
   * Updating notes list after creating/updating a note.
   */
  createEventEmitter(data) {
    if (data.id) {
      this.notesList.unshift(data);
      this.setSelectedNote(this.notesList[0], 0);
      this.showCreateEditor = false;
    }
  }

  updateEventEmitter(data) {
    this.notesList = this.notesList.filter((note) => {
      return note.id !== data.id;
    });
    this.notesList.unshift(data);
    this.setSelectedNote(this.notesList[0], 0);
    this.showUpdateEditor = false;
  }

  /**
   * This event listener updates the notesList array once a note is removed.
   */
  deleteEventEmitter(noteId) {
    this.notesList = this.notesList.filter((note) => {
      return note.id !== noteId;
    });
    if (this.selectedIndex === 0) {
      this.setSelectedNote(this.notesList[0], 0);
    } else {
      this.setSelectedNote(this.notesList[this.selectedIndex - 1], this.selectedIndex - 1);
    }
    this.showDelete = false;
  }

  /**
   * This method helps in redirecting the user to parent url.
   */
  public redirect() {
    const params = _.get(this.activatedRoute, 'snapshot.params.contentId');
    if (this.batchId && params) {
      const navigationExtras = {
        queryParams: { 'contentId': params },
        relativeTo: _.get(this.activatedRoute, 'parent')
      };
      this.route.navigate([this.courseId, 'batch', this.batchId], navigationExtras);
    } else if (this.batchId) {
      const navigationExtras = {
        relativeTo: _.get(this.activatedRoute, 'parent')
      };
      this.route.navigate([this.courseId, 'batch', this.batchId], navigationExtras);
    } else {
      this.route.navigate(['/resources/play/content/', this.contentId]);
    }
  }
  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.id;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.id,
          objtype: 'note',
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
