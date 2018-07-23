
import {takeUntil} from 'rxjs/operators';
import { NotesService } from '../../services';
import { UserService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';
import { INoteData, IdDetails } from '@sunbird/notes';

import { Subject } from 'rxjs';

/**
 * This component provides the editor popup to create and update notes.
 */

@Component({
  selector: 'app-inline-editor',
  templateUrl: './inline-editor.component.html',
  styleUrls: ['./inline-editor.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class InlineEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * This variable holds the content and course id.
   */
  @Input() ids: IdDetails;
  /**
   * This variable helps in passing the 'mode' details to the note form.
   * The mode can be either 'create' or 'update'. The editor updates it's
   * buttons with respect to the 'mode' value.
   */
  @Input() mode: string;
  /**
   * Stores the details of a note selected by the user.
   */
  @Input() selectedNote: INoteData;
  /**
   * An event emitter to hide the editor while the 'cross' icon in update editor is clicked.
   */
  @Output() exitUpdateEditor = new EventEmitter<boolean>();
  /**
   * An event emitter to update notes list after updating note.
   */
  @Output() updateEventEmitter: EventEmitter<any> = new EventEmitter();
  /**
   * An event emitter to update notes list after creating note.
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
   * The variable on which update action is carried out on.
   */
  updateData: INoteData;
  /**
   * This variable holds the entire array of existing notes at any point
   * in time.
   */
  notesList: Array<INoteData>;

  /**
   * To save noteId from params.
   */
  noteId: string;
  /**
   * To save selectedNote's index value.
   */
  selectedIndex: number;
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

  public unsubscribe$ = new Subject<void>();

  /**
   * The constructor
   *
   * @param {ToasterService} iziToast Reference of toasterService.
   * @param {UserService} userService Reference of userService.
   * @param {ContentService} contentService Reference of contentService.
   * @param {ResourceService} resourceService Reference of resourceService.
   * @param {NotesService} notesService Reference of notesService.
   */

  constructor(
    resourceService: ResourceService,
    userService: UserService,
    noteService: NotesService,
    toasterService: ToasterService
  ) {
    this.noteService = noteService;
    this.userService = userService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
  }

  /**
   * To initialize noteData and gather course and content ids.
   */
  ngOnInit() {
    this.updateData = { ...this.selectedNote };
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

  public exitEditor() {
    this.exitUpdateEditor.emit();
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
    if (this.ids.contentId || this.ids.courseId) {
      const requestData = {
        request: {
          note: this.noteData.note,
          userId: this.userService.userid,
          title: this.noteData.title,
          courseId: this.ids.courseId,
          contentId: this.ids.contentId,
          createdBy: this.userService.userid,
          updatedBy: this.userService.userid
        }
      };
      this.noteService.create(requestData).pipe(
        takeUntil(this.unsubscribe$))
        .subscribe(
          (data: INoteData) => {
            if (data.id) {
              this.createEventEmitter.emit(data);
              this.toasterService.success(this.resourceService.messages.smsg.m0009);
            }
          },
          (err) => {
            this.toasterService.error(this.resourceService.messages.fmsg.m0030);
          }
        );
    }
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
    this.noteService.update(requestData).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(
        (data: INoteData) => {
          this.updateData.updatedDate = new Date().toISOString();
          this.updateEventEmitter.emit(data);
          this.toasterService.success(this.resourceService.messages.smsg.m0013);
        },
        (err) => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0034);
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
