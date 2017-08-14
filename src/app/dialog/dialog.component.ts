import { EventService } from './../providers/event.service';
import * as events from 'events';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Food, Macros , units} from '../data-model';
import { MdDialog, MdDialogRef} from '@angular/material';
import {MD_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent  {

  @Input() value: string;
  @Input() showPrompt: boolean;
  @Input() placeholder: string;
  @Input() title: string;
  @Input() template: string;
  @Input() okText: string;
  @Input() cancelText: string;
  @Output() valueEmitted = new EventEmitter<string>();

  constructor(public dialogRef: MdDialogRef<DialogComponent>,
    @Inject(MD_DIALOG_DATA) public food: any,
    private eventService: EventService) {
  }

  saveAmount() {
   // this.valueEmitted.emit(value);
    this.eventService.displayCancel(false);
    this.eventService.displaySave(true);
  }

}
