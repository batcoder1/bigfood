import { forEach } from '@angular/router/src/utils/collection';
import { Food, Meal, Profile, User, Units, Goals, DietDays } from './../data-model';
import { Observable } from 'rxjs/Observable';
import { Injectable, Input } from '@angular/core';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class FireService {
  user: Observable<firebase.User>;
  foods: FirebaseListObservable<any[]>;
  afAuth: AngularFireAuth;
  profile: Profile;
  fireUser: firebase.User;
  database: any;
  calendar: DietDays[];

  constructor(afAuth: AngularFireAuth, db: AngularFireDatabase) {
    this.user = afAuth.authState;
    this.foods = db.list('foods');
    this.afAuth = afAuth;
    this.database = firebase.database();
  }

  loginWithGoogle() {
     return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  getUserProfile() {
    const database = firebase.database();
    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));

    return firebase.database().ref('/profiles/' + this.fireUser.uid).once('value');
  }


  getFoods() {
    return this.database.ref('/foods').once('value');
  }
  getGoals() {
    return this.database.ref('/goals').once('value');
  }
  getUserMeals() {
    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));
    return this.database.ref('/meals/' + this.fireUser.uid).once('value');
  }
  getUserDietDays() {
    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));
    return this.database.ref('/dietDays/' + this.fireUser.uid).once('value');
  }

  getFoodById(id): Promise<Food> {
    return new Promise((resolve, reject) => {
      this.getFoods().then(snapshot => {
        snapshot.forEach(child => {
        const food = child.val();
        if (food.id === id) {
           resolve(food);
        }
        });
      });
    });
  }
  setUserData(fireUser: firebase.User) {
    this.database.ref('users/' + fireUser.uid).set({
      email: fireUser.email,
      profile_picture : fireUser.photoURL,
    });
  }
  setUserProfile(userId, profile: Profile) {
    this.database.ref('profiles/' + userId).set({
      username: profile.username,
      imageUrl: profile.imageUrl,
      email: profile.email,
      birthday : profile.birthday,
      height : profile.height,
      weight: profile.weight,
      country: profile.country,
      postalCode: profile.postalCode
    });
  }

  setUserDietDays(userId, dietDays: DietDays[]) {
    this.database.ref('dietDays/' + userId).set({
         dietDays: dietDays
    });
  }
  setUserGoals(userId, goals: Goals) {
    this.database.ref('goals/' + userId).set({
      initialWeight: goals.initialWeight,
      currentWeight: goals.currentWeight,
      desireWeight: goals.desireWeight,
      weeklyGoal:  goals.weeklyGoal,
      activityLevel: goals.activityLevel
    });
  }
 setUserUnits(userId, units: Units) {
    this.database.ref('units/' + userId).set({
      weight: units.weight,
      height: units.height,
      distance: units.distance,
      Energy: units.Energy,
      water: units.water
    });
  }
}
