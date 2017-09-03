import { elementAt } from 'rxjs/operator/elementAt';
import { EventService } from './../providers/event.service';
import * as events from 'events';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { COUNTRIES, Food, Macros, UNITS, User, UserData } from '../data-model';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {

  @Input() value: string;
  @Input() showPrompt: boolean;
  @Input() placeholder: string;
  @Input() title: string;
  @Input() template: string;
  @Input() okText: string;
  @Input() cancelText: string;
  @Output() valueEmitted = new EventEmitter<string>();
  food: Food;
  user: User;
  userData: UserData;
  goals= [];
  countries = [];
  constructor(public dialogRef: MdDialogRef<DialogComponent>,
    @Inject(MD_DIALOG_DATA) public element: any,
    private eventService: EventService) {
    this.goals = [
      {id: 0, value: 'Perder 0,75 kg por semana'},
      {id: 1, value: 'Perder 0,5 kg por semana'},
      {id: 2, value: 'Perder 0,25 kg por semana'},
      {id: 3, value: 'Mantener mi peso actual'},
      {id: 4, value: 'Ganar 0,25 kg por semana'},
      {id: 5, value: 'Ganar 0,5 kg por semana'}
    ];
    this.countries = COUNTRIES;
    if (element && element.hasOwnProperty('label')) {
      this.userData = new UserData(element.label, element.value[element.nomvar], element.nomvar);
      this.user = element.value;


    } else {
      this.food = element;
    }
  }

  save() {
    // this.valueEmitted.emit(value);
    this.eventService.displayCancel(true);
    this.eventService.displaySave(true);
  }
  updateWeekyGoal(goal: any) {
    this.user.goals.weeklyGoal = goal.id;
  }
  updateCountry(idCountry: any) {
    this.user.country = idCountry;
  }
}
