import { Food, Meal, Profile, User, Units, Goals } from './../data-model';
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
  constructor(afAuth: AngularFireAuth, db: AngularFireDatabase) {
    this.user = afAuth.authState;
    this.foods = db.list('foods');
    this.afAuth = afAuth;
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
    const database = firebase.database();
    return database.ref('/foods').once('value');
  }
  getUserMeals() {
    const database = firebase.database();
    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));

    return database.ref('/meals/' + this.fireUser.uid).once('value');
  }

  getFoodById(id): Promise<Food> {
    return new Promise((resolve, reject) => {
      const database = firebase.database();
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
    firebase.database().ref('users/' + fireUser.uid).set({
      email: fireUser.email,
      profile_picture : fireUser.photoURL,
    });
  }
  setUserProfile(userId, profile: Profile) {
    firebase.database().ref('profiles/' + userId).set({
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
  setUserMeals(userId, meals: Meal[]) {
    firebase.database().ref('meals/' + userId).set({
      meals: meals
    });
  }
  setUserGoals(userId, goals: Goals) {
    firebase.database().ref('goals/' + userId).set({
      initialWeight: goals.initialWeight,
      currentWeight: goals.currentWeight,
      desireWeight: goals.desireWeight,
      weeklyGoal:  goals.weeklyGoal,
      activityLevel: goals.activityLevel
    });
  }
 setUserUnits(userId, units: Units) {
    firebase.database().ref('units/' + userId).set({
      weight: units.weight,
      height: units.height,
      distance: units.distance,
      Energy: units.Energy,
      water: units.water
    });
  }
}
