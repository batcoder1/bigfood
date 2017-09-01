import { Goals, units, Units, User } from './../data-model';
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
  goals: Goals;
  units: Units;
  constructor(public fireService: FireService) {
   fireService.getUserProfile().then(snapshot => this.user = snapshot.val());
   fireService.getGoals().then(snapshot => this.goals = snapshot.val());
  }

  ngOnInit() {
  }

}
