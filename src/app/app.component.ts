import { User } from './data-model';
import { EventService } from './providers/event.service';
import { ActiveStateService } from './providers/active-state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FireService } from './providers/fire.service';
import { AfterViewInit, Component, DoCheck, OnChanges, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as firebase from 'firebase/app';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements DoCheck {
  public isLoggedIn: boolean;
  activaCancelBotton = false;
  activaSaveBotton = false;
  state: ActiveStateService;
  subscribe: any;


  constructor(private fireService: FireService,
    private router: Router,
    private _location: Location,
    private _state: ActiveStateService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

    this.state = _state;
    // checkea de forma async si nuestro usuario esta logeado and redirigirá
    // automaticamente al login cuando el estado cambie.
    this.fireService.afAuth.authState.subscribe(
      (auth) => {
        if (auth == null) {
          console.log('Not Logged in.');
          this.router.navigate(['login']);
          this.isLoggedIn = false;
        }
        else {
          console.log('Successfully Logged in.');
          this.isLoggedIn = true;
          localStorage.setItem('fireUser', JSON.stringify(auth));

          this.router.navigate(['']);
        }
      }
    );
  }
  goBack() {
    localStorage.removeItem('userData');
    localStorage.removeItem('foodDetail');
    this._location.back();

  }
  goHome() {
    const user: User = JSON.parse(localStorage.getItem('userData'));
    const fireUser = JSON.parse(localStorage.getItem('fireUser'));
    if (user !== null && fireUser !== null) {
      this.fireService.setUserData(fireUser, user);
    }
    this.router.navigate(['']);
  }

  doLogout() {
    console.log('logout');
    this.fireService.logout();
  }
  onFoodList(onfoodList: boolean) {
    this.activaCancelBotton = onfoodList;
  }
  ngInit() {
    this.eventListener();
  }
  ngDoCheck() {
    this.eventListener();
  }

  eventListener() {
    this.eventService.displayStream.subscribe(buttonShow => {
      this.activaCancelBotton = buttonShow;

    });
    this.eventService.saveStream.subscribe(buttonShow => {
      this.activaSaveBotton = buttonShow;

    });
    this.cdr.detectChanges();

  }

}
