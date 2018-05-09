import { NotesService } from '../../services';
import { UserService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';
import { INoteData, ICourseDetails } from '@sunbird/notes';

/**
 * This component provides the editor popup to create and update notes.
 */

@Component({
  selector: 'app-popup-editor',
  templateUrl: './popup-editor.component.html',
  styleUrls: ['./popup-editor.component.css']
})

export class PopupEditorComponent implements OnInit, AfterViewInit {
  @Input() courseDetails: ICourseDetails;
  /**
   * This variable helps in passing the 'mode' details to the note form.
   * The mode can be either 'create' or 'update'. The note form updates it's
   * buttons with respect to the 'mode' value.
   */
  @Input() mode: string;
  /**
   * Stores the details of a note selected by the user.
   */
  @Input() selectedNote: INoteData;
  /**
   * An event emitter to exit editor modal.
   */
  @Output() exitModal = new EventEmitter<boolean>();
  /**
   * An event emitter to update notes list after updating a note.
   */
  @Output() updateEventEmitter: EventEmitter<any> = new EventEmitter();
  /**
   * An event emitter to update notes list after creating a note.
   */
  @Output() createEventEmitter: EventEmitter<any> = new EventEmitter();
  /**
   * To call the resource service.
   */
  resourceService: ResourceService;
  /**
   * To bind the user input and modal.
   */
  noteData: INoteData = {};
  /**
   * This variable holds the value of the note to be updated.
   */
  updateData: INoteData;
  /**
   * This variable holds the entire array of existing notes at any point
   * in time.
   */
  notesList: Array<INoteData>;
  /**
   * To get course and note params.
   */
  private activatedRoute: ActivatedRoute;
  /**
   * To save selectedNote's index value.
   */
  selectedIndex: number;
  /**
   * The course id of the selected course.
   */
  courseId: string;
  /**
   * The content id of the selected content.
   */
  contentId: string;
  /**
   * To sort notes array when making a search api call.
   */
  sortBy = 'desc';
  /**
   * This variable helps in displaying and hiding page loader.
   * By default it is assigned a value of 'true'. This ensures that
   * the page loader is displayed the first time the page is loaded.
   */
  showLoader: boolean;
  /**
   * Reference of apiResponse.
   */
  apiResponse: ServerResponse;
  /**
   * To display toaster(if any) after each API call.
   */
  private toasterService: ToasterService;
  /**
   * Reference of user service.
   */
  userService: UserService;
  /**
   * Reference of notes service.
   */
  noteService: NotesService;


  /**
   * The constructor
   *
   * @param {ToasterService} iziToast Reference of toasterService.
   * @param {UserService} userService Reference of userService.
   * @param {ContentService} contentService Reference of contentService.
   * @param {ResourceService} resourceService Reference of resourceService.
   * @param {NotesService} notesService Reference of notesService.
   * @param {ActivatedRoute} activatedRoute Reference of activatedRoute.
   */

  constructor(
    resourceService: ResourceService,
    userService: UserService,
    noteService: NotesService,
    activatedRoute: ActivatedRoute,
    toasterService: ToasterService) {
    this.noteService = noteService;
    this.userService = userService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.activatedRoute = activatedRoute;
  }

  /**
   * To initialize noteData and gather course and content ids.
   */
  ngOnInit() {
    this.updateData = { ...this.selectedNote };
    /**
     * Gathering courseId and contentId from parent params
     */
    if (this.courseDetails && this.courseDetails.courseId) {
      this.courseId = this.courseDetails.courseId;
    }
    if (this.courseDetails && this.courseDetails.contentId) {
      this.contentId = this.courseDetails.contentId;
    }
    if (!this.courseId && !this.contentId) {
      this.activatedRoute.params.subscribe((params) => {
        this.courseId = params.courseId;
        this.contentId = params.contentId;
      });
    }
  }

  /**
   * To convert markdown inputs in the editor to html format.
   */
  ngAfterViewInit() {
    const converter1 = Markdown.getSanitizingConverter();
    converter1.hooks.chain('preBlockGamut', (text, rbg) => {
      return text.replace(/^ {0,3}""" *\n((?:.*?\n)+?) {0,3}""" *$/gm, (whole, inner) => {
        return '<blockquote>' + rbg(inner) + '</blockquote>\n';
      });
    });
    const editor1 = new Markdown.Editor(converter1);
    editor1.run();
  }
  /**
   * This method redirects the user from the editor.
  */
  public redirect() {
    this.exitModal.emit();
  }

  /**
   * This method resets the note "Title" and "Description" when "CLEAR" button
   * is clicked.
  */
  public clearNote() {
    this.noteData.title = '';
    this.noteData.note = '';
  }

  /**
   * This method calls the create API.
  */
  public createNote() {
    const requestData = {
      request: {
        note: this.noteData.note,
        userId: this.userService.userid,
        title: this.noteData.title,
        courseId: this.courseId,
        contentId: this.contentId,
        createdBy: this.userService.userid,
        updatedBy: this.userService.userid
      }
    };
    this.noteService.create(requestData).subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        const returnObj = {
          note: requestData.request.note,
          userId: requestData.request.userId,
          title: requestData.request.title,
          courseId: requestData.request.courseId,
          contentId: requestData.request.contentId,
          createdBy: requestData.request.createdBy,
          updatedBy: requestData.request.updatedBy,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        };
        this.createEventEmitter.emit(returnObj);
      },
      (err) => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0030);
      }
    );
  }

  /**
   * This method calls the update API.
   */
  public updateNote() {
    const requestData = {
      noteId: this.updateData.id,
      request: {
        note: this.updateData.note,
        title: this.updateData.title,
        updatedBy: this.updateData.userId
      }
    };
    this.noteService.update(requestData).subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        this.updateData.updatedDate = new Date().toISOString();
        const returnObj = {
          note: this.updateData.note,
          title: this.updateData.title,
          updatedDate: new Date().toISOString(),
          id: requestData.noteId
        };
        this.updateEventEmitter.emit(returnObj);
      },
      (err) => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0034);
      }
    );
  }
}
