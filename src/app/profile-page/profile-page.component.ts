import { MdDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { EventService } from '../providers/event.service';
import { Goals, UNITS, COUNTRIES, Units, User } from './../data-model';
import { FireService } from './../providers/fire.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: User;

  units: Units;
  selectedOption: string;
  countries = [];
  myGoal: string;
  goals = [
    {id: 0, value: 'Perder 0,75 kg por semana'},
    {id: 1, value: 'Perder 0,5 kg por semana'},
    {id: 2, value: 'Perder 0,25 kg por semana'},
    {id: 3, value: 'Mantener mi peso actual'},
    {id: 4, value: 'Ganar 0,25 kg por semana'},
    {id: 5, value: 'Ganar 0,5 kg por semana'}
  ];
  constructor(public fireService: FireService,
    private eventService: EventService,
    public dialog: MdDialog) {
      this.countries = COUNTRIES;
    // fireService.setUserData(JSON.parse(localStorage.getItem('fireUser')), this.user);
    fireService.getUserData().then(snapshot => this.user = snapshot.val());
  }
  saveData() {
    // this.valueEmitted.emit(value);
    this.eventService.displayCancel(true);
    this.eventService.displaySave(true);
    localStorage.setItem('userData', JSON.stringify(this.user));
  }

  openDialog(label: string, user: User, nomvar: string) {
    const dataUser = {
      label : label,
      value : user,
      nomvar: nomvar
    };
    const dialogRef = this.dialog.open(DialogComponent, { data: dataUser });

    dialogRef.afterClosed().subscribe(res => {
      this.user = dataUser.value;
      this.myGoal =  this.goals[dataUser.value.goals.weeklyGoal].value;
    });
  }

  ngOnInit() {
  }

}
