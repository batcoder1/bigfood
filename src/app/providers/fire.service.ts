import { forEach } from '@angular/router/src/utils/collection';
import { Food, Meal, User, Units, Goals, DietDays } from './../data-model';
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
  fireUser: firebase.User;
  database: any;
  calendar: DietDays[];

  constructor(afAuth: AngularFireAuth, db: AngularFireDatabase) {
    this.user = afAuth.authState;
    this.foods = db.list('foods');
    this.afAuth = afAuth;
    this.database = firebase.database();
    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));
  }

  loginWithGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  loginWithMail(mail, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(mail, password);

  }
  logout() {
    return this.afAuth.auth.signOut();
  }

  getUser() {
    const database = firebase.database();
    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));
    return this.database.ref('/users/' + this.fireUser.uid).once('value');
  }
  getUserData() {
    const database = firebase.database();
    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));

    return this.database.ref('/profiles/' + this.fireUser.uid).once('value');
  }
  setUserData(fireUser: firebase.User, user: User) {
    this.database.ref('profiles/' + fireUser.uid).set({
      birthday: user.birthday,
      email: user.email,
      postalCode: user.postalCode,
      country: user.country,
      goals: user.goals,
      units: user.units,
      weight: user.weight,
      height: user.height,
      name: user.name,
      gender: user.gender,
      photo: fireUser.photoURL

    });
  }
  createUser(fireUser: firebase.User) {
    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));
    return new Promise((resolve, reject) => {
        this.database.ref('users/' + fireUser.uid).set({
          email: fireUser.email,
          profile_picture: fireUser.photoURL
        });
      resolve(0);
    });
  }
 createUserByMail(email: string, password: string) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
 }
  getFoods() {
    return this.database.ref('/foods').once('value');
  }
  sendEmailVerification() {
    return firebase.auth().currentUser.sendEmailVerification();
  }
  getUserDietDays() {
    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));
    return this.database.ref('/dietDays/' + this.fireUser.uid).once('value');
  }
  currentUser() {
    return firebase.auth().currentUser;
  }
  setUserDietDay(userId, dietDay, id) {
    this.database.ref('dietDays/' + userId + '/' + id).set(dietDay);
  }
  setUserDietMonth(userId, dietDays: DietDays[]) {
    const dietRef = firebase.database().ref('dietDays/' + userId);

    dietRef.set(dietDays);



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


}
