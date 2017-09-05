import { ChartsModule } from 'ng2-charts';
import { LongPressDirective } from './directives/long-press.directive';
import { MdDialogModule, MdDialogRef } from '@angular/material';
import { EventService } from './providers/event.service';
import { ActiveStateService } from './providers/active-state.service';
import { FireService } from './providers/fire.service';
import { DialogComponent } from './dialog/dialog.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { FoodListComponent } from './food-list/food-list.component';
import { FoodDetailComponent } from './food-detail/food-detail.component';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule, MdCheckboxModule, MdListModule, MdCardModule,
  MdToolbarModule, MdListItem, MdIconModule, MdMenuModule, MdTabsModule, MdDialogContainer, MdSelectModule,
  MdProgressSpinnerModule, MdSliderModule, MdRadioModule, MdDatepickerModule, MdNativeDateModule, DateAdapter, MD_DATE_FORMATS
} from '@angular/material';
import { LoginPageComponent } from './login-page/login-page.component';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ProgressPageComponent } from './progress-page/progress-page.component';



// Initialize Firebase

export const firebaseConfig = {
  apiKey: 'AIzaSyADF4n2WgMR39MruI5JFM5vkJJXG-HgChg',
  authDomain: 'bigfood-7576a.firebaseapp.com',
  databaseURL: 'https://bigfood-7576a.firebaseio.com',
  projectId: 'bigfood-7576a',
  storageBucket: 'bigfood-7576a.appspot.com',
  messagingSenderId: '735026853257'
};
const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  display: {
    // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};

const routes: Routes = [
  { path: '', component: HomePageComponent, data: { stateName: 'home' } },
  { path: 'food-list', component: FoodListComponent, data: { stateName: 'food-list' } },
  { path: 'food-detail/:id', component: FoodDetailComponent, data: { stateName: 'food-detail' } },
  { path: 'profile', component: ProfilePageComponent, data: { stateName: 'profile' } },
  { path: 'login', component: LoginPageComponent, data: { stateName: 'login' } },
  { path: 'progress', component: ProgressPageComponent, data: { stateName: 'progress' } }
];
@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MdButtonModule, MdCheckboxModule, MdListModule, MdCardModule, MdSliderModule,
    MdToolbarModule, MdIconModule, MdMenuModule, MdTabsModule, MdRadioModule,
    MdSelectModule, MdDialogModule, MdProgressSpinnerModule, MdDatepickerModule,
    ReactiveFormsModule, FormsModule, MdNativeDateModule, ChartsModule,
    RouterModule.forRoot(routes)
  ],
  entryComponents: [
    DialogComponent
  ],
  declarations: [
    AppComponent,
    HomePageComponent,
    FoodDetailComponent,
    FoodListComponent,
    LoginPageComponent,
    FoodDetailComponent,
    LoginPageComponent,
    ProfilePageComponent,
    DialogComponent,
    LongPressDirective,
    ProgressPageComponent
  ],
  exports: [
    AppComponent,
    HomePageComponent,
    FoodDetailComponent,
    FoodListComponent,
    DialogComponent,
    FormsModule,
    MdButtonModule, MdCheckboxModule, MdListModule, MdCardModule, MdMenuModule, MdSliderModule,
    MdToolbarModule, MdIconModule, MdTabsModule, MdDialogModule, MdSelectModule, MdRadioModule,
    MdProgressSpinnerModule, LongPressDirective, MdDatepickerModule, MdNativeDateModule, ChartsModule
  ],
  providers: [FireService, ActiveStateService, EventService,
    { provide: MD_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
