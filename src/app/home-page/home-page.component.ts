import { Subscription } from 'rxjs/Rx';
import { Route, NavigationEnd, Router } from '@angular/router';
import { EventService } from '../providers/event.service';
import { ChangeDetectorRef } from '@angular/core';

import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnChanges,
  OnInit
} from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { FireService } from './../providers/fire.service';
import {
  Food,
  Goals,
  Macros,
  Meal,
  Profile,
  Units,
  User
} from './../data-model';
import { forEach } from '@angular/router/src/utils/collection';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements AfterViewChecked, OnInit {

  isloggin: boolean;
  user: User;
  myUser: any;
  fireUser: firebase.User;
  meals: Meal[];
  foods: FirebaseListObservable<Food[]>;
  totalMealCalories: number[] = [];
  profile: Profile;
  goals: Goals;
  meal: Meal;
  unit: Units;
  totalCalories = 0;
  goalDay: number;
  exercise = 0;
  rest = 0;
  activity = [1.2, 1.375, 1.55, 1.725, 1.9];
  fireService: FireService;
  buttonSubscription: Subscription;

  constructor(fireService: FireService,
    private eventService: EventService,
    private router: Router,
    private cdr: ChangeDetectorRef) {
    this.fireService = fireService;
  }

  ngOnInit(): void {
    this.totalCalories = 0;
    this.goalDay = 0;
    this.exercise = 0;
    this.rest = 0;

    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));
    this.eventService.displaySave(false);

    this.profile = new Profile();
    this.fireService.setUserData(this.fireUser);

    this.profile = {
      imageUrl: this.fireUser.photoURL,
      email: this.fireUser.email,
      username: this.fireUser.email.split('@')[0],
      birthday: '15-06-1980',
      height: 173,
      weight: 76,
      country: 'España',
      postalCode: 28020
    };
    // fireService.setUserProfile(this.fireUser.uid, this.profile);

    // this.meals = [
    //   { name: 'Desayuno', foods: [] },
    //   { name: 'Comida', foods: [] },
    //   { name: 'Cena', foods: [] }
    // ];
    // fireService.setUserMeals(this.fireUser.uid, this.meals);

    this.goals = { initialWeight: 0, currentWeight: 0, desireWeight: 0, weeklyGoal: 0, activityLevel: 0 };
    this.fireService.setUserGoals(this.fireUser.uid, this.goals);


    this.fireService.getUserProfile()
      .then(snapshot => this.profile = snapshot.val());


    this.fireService.getFoods()
      .then(snapshot => {
        snapshot.forEach(child => this.foods = child.val());
      });

    this.fireService.getUserMeals()
      .then(snapshot => {
        snapshot.forEach(child => {
          const meals = child.val();
          meals.forEach(meal => {
            const myfoods: Food[] = [];
            let myfood: Food;
            meal.foods.forEach(food => {
              this.fireService.getFoodById(food.id).then(f => {
                myfood = f;
                myfood.amount = food.amount;
                myfoods.push(myfood);
                meal.foods.slice(0, 1);
              });
            });
            meal.foods = myfoods;
          });
          this.meals = meals;
        });
      });
  }
  ngAfterViewChecked() {
    if (this.meals) {
      this.totalCalories = 0;
    this.addFoodToMeal();
      this.mealsCaloriesSum();
      this.goalDay = this.caloriesBurnedAtDay();
      this.rest = this.goalDay - this.totalCalories + this.exercise;
      this.cdr.detectChanges();
    }
  }

  mealsCaloriesSum() {
    this.totalMealCalories = [];
    let foodExist = false;
    if (this.meals) {
      this.meals.forEach(meal => {
        let totalCalories = 0;
        if (meal.foods) {
          meal.foods.forEach(food => {
            totalCalories += food.calories;
            foodExist = true;
          });
          if (foodExist) {
            this.totalMealCalories.push(totalCalories);
            this.totalCalories += totalCalories;
          }

        }
      });

    }
  }

  addFoodToMeal() {
    if (this.meals) {
      this.meals.forEach(meal => {
        if (meal.foods && meal.foods.length > 0) {
          meal.foods.forEach(food => {
            if (localStorage.getItem('foodDetail')) {
              const foodDetail = JSON.parse(localStorage.getItem('foodDetail'));
              // TODO cuando se crea el usuario, las meals no tienen food, no se puede hacer push si no existe el array foods
              localStorage.removeItem('foodDetail');
              const comida = JSON.parse(localStorage.getItem('comidaSelected'));
              this.meals[comida].foods.push(foodDetail);

              localStorage.removeItem('foodDetail');
              localStorage.removeItem('comidaSelected');
              this.fireService.setUserMeals(this.fireUser.uid, this.meals);
            }
          });
        }
      });
    }

  }
  caloriesBurnedAtDay(): number {
    const res = this.profile.birthday.split('-');
    const fechaNac = new Date(res[1] + '-' + res[0] + '-' + res[2]);
    const fechaNacMilisec = fechaNac.getMilliseconds();
    const hoy = new Date();
    const hoyMilisec = hoy.getMilliseconds();
    const edad = (hoyMilisec - fechaNacMilisec) / 1000 / 60 / 60 / 24 / 365;

    const tmb = (10 * this.profile.weight) + (6.25 * this.profile.height) - (5 * edad);
    const total = Math.round(tmb * this.activity[this.goals.activityLevel]);

    return total;
  }
  goToFoodList(comidaSelected) {
    localStorage.setItem('comidaSelected', comidaSelected);
    this.eventService.displayCancel(true);
    this.eventService.displaySave(true);
    this.router.navigate(['/food-list']);
    event.preventDefault();
  }
  goToDetail(food: Food) {
    this.eventService.displayCancel(true);
    this.router.navigate(['/food-detail', food.id]);
  }
}
