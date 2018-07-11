
import {takeUntil} from 'rxjs/operators';
import { PopupEditorComponent } from './../popup-editor/popup-editor.component';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { NotesService } from '../../services';
import { UserService, ContentService } from '@sunbird/core';
import { Component, OnInit, Pipe, PipeTransform, Input, OnChanges, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import { INoteData, IdDetails } from '@sunbird/notes';
import * as _ from 'lodash';

import { Subject } from 'rxjs';

/**
 * This component holds the note card widget.
 */

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styles: [' ::ng-deep .notedec ul li { list-style-type: disc; margin-bottom: 10px; }']
})
export class NoteCardComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * This variable holds the content and course id.
   */
  @Input() ids: IdDetails;
  /**
   * This variable holds the created note details
   */
  @Input() createNoteData: INoteData;
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
  notesList: Array<INoteData>;

  /**
   *Stores the details of a note selected by the user.
   */
  selectedNote: INoteData;
  /**
   * This variable helps redirecting the user to NotesList view once
   * a note is created or updated.
   */
  route: Router;
  /**
   * Stores the index of the selected note in notesList array.
   */
  selectedIndex: number;
  /**
   * This variable stores the search input from the search bar.
   */
  searchData: string;
  /**
   * user id from user service.
   */
  userId: string;
  /**
   * To display toaster(if any) after each API call.
   */
  private toasterService: ToasterService;
  /**
   * To create or update a note.
   */
  noteService: NotesService;
  /**
   * To retrieve user details.
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
  activatedRoute: ActivatedRoute;
  batchId: string;
  public unsubscribe$ = new Subject<void>();


  /**
   * The constructor
   *
   * @param {ToasterService} toasterService Reference of toasterService.
   * @param {UserService} userService Reference of userService.
   * @param {ContentService} contentService Reference of contentService.
   * @param {ResourceService} resourceService Reference of resourceService.
   * @param {SuiModalService} modalService Reference of modalService.
   * @param {NotesService} notesService Reference of notesService.
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
    this.route = route;
    this.noteService = noteService;
    this.userService = userService;
    this.contentService = contentService;
    this.resourceService = resourceService;
    this.modalService = modalService;
    this.activatedRoute = activatedRoute;
  }

  /**
   * Initializing notesList and selectedNote values.
   */
  ngOnInit() {
    this.notesList = [];
    /**
     * Initializing notesList array
     */
    this.userId = this.userService.userid;
    this.getAllNotes();
  }

  ngOnChanges() {
    if (this.createNoteData) {
      this.notesList = this.notesList || [];
      this.notesList.unshift(this.createNoteData);
      this.setSelectedNote(this.notesList[0], 0);
      this.showCreateEditor = false;
    }
  }

  /**
   * To gather existing list of notes.
   */
  public getAllNotes() {
    const requestBody = {
      request: {
        filters: {
          userId: this.userId,
          courseId: this.ids.courseId,
          contentId: this.ids.contentId
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
          this.notesList = apiResponse.result.response.note;
          this.selectedNote = this.notesList[0];
        },
        (err) => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0033);
        }
      );
    }
  }

  /**
   * This method sets the value of a selected note to the variable 'selectedNote'
   * @param note The selected note from list view.
   * @param a Index of selected note.
   */
  public setSelectedNote(note, a) {
    this.selectedNote = note;
    this.selectedIndex = a;
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
   * This method redirects the user to notesList view.
   */
  public viewAllNotes() {
    this.activatedRoute.params.subscribe(params => {
      this.batchId = params.batchId;
      const queryContentId = _.get(this.activatedRoute, 'snapshot.queryParams.contentId');
      if (this.batchId && queryContentId) {
          this.route.navigate(['/learn/course', this.ids.courseId, 'batch', this.batchId, 'notes', queryContentId]);
        } else if (this.batchId) {
          this.route.navigate(['/learn/course', this.ids.courseId, 'batch', this.batchId, 'notes']);
      } else {
        this.route.navigate(['/resources/play/content/', this.ids.contentId, 'note']);
      }
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
