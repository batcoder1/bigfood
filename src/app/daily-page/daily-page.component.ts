import { AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, PipeTransform } from '@angular/core';
import {
  DietDays,
  Food,
  Goals,
  Macros,
  Meal,
  Units,
  User
} from './../data-model';
import { EventService } from '../providers/event.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { FireService } from './../providers/fire.service';
import { forEach } from '@angular/router/src/utils/collection';
import { NavigationEnd, Route, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';


@Component({
  selector: 'app-daily-page',
  templateUrl: './daily-page.component.html',
  styleUrls: ['./daily-page.component.css']
})
export class DailyPageComponent implements AfterViewChecked, OnInit {


  isloggin: boolean;
  user: User;
  myUser: any;
  fireUser: any;
  calendar: Date[];
  day: DietDays;
  days: DietDays[];
  foods: FirebaseListObservable<Food[]>;
  totalMealCalories: number[] = [];
  goals: Goals;
  meal: Meal;
  meals: Meal[];
  units: Units;
  totalCalories = 0;
  goalDay: number;
  exercise = 0;
  rest = 0;
  activity = [1.2, 1.375, 1.55, 1.725, 1.9];
  fireService: FireService;
  buttonSubscription: Subscription;
  today: string;
  indexDays: number;
  backArrowValid = true;
  forwardArrowValid = true;
  dateDay: Date;
  stepsToday: number;
  currentUser: any;
  constructor(fireService: FireService,
    private eventService: EventService,
    private router: Router,
    private cdr: ChangeDetectorRef) {
    this.fireService = fireService;
    this.currentUser = this.fireService.currentUser();
  }

  ngOnInit(): void {
    this.fireUser = JSON.parse(localStorage.getItem('fireUser'));
    this.goals = { initialWeight: 70, currentWeight: 70, desireWeight: 70, weeklyGoal: 0, activityLevel: 1, stepsAtDay: 10000 };
    this.units = { weight: 'kg', height: 'cm', distance: 'km', Energy: 'kcal', water: 'l' };

    this.calendar = this.getDaysInMonth(new Date().getMonth());
    this.totalCalories = 0;
    this.goalDay = 0;
    this.exercise = 0;
    this.rest = 0;
    this.indexDays = 0;
    this.eventService.displaySave(false);


    this.meals = [
      { name: 'Desayuno', foods: [] },
      { name: 'Comida', foods: [] },
      { name: 'Cena', foods: [] }
    ];

    this.day = { date: new Date(), meals: this.meals, goalDay: 0, totalCalories: 0, exercise: 0, weight: 0, steps: 0 };
    this.days = [];
    this.actualizarDiario();

    this.recuperarUsuario();

    this.recuperarInfoUsuario();

    this.recuperarAlimentos();


  }
  ngAfterViewChecked() {
    const foodDetail = JSON.parse(localStorage.getItem('foodDetail'));
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData !== undefined && userData !== null) {
      this.fireService.setUserData(this.fireUser, userData);
      this.updateCalories(userData);
      localStorage.removeItem('userData');
    }
    if (this.days && this.days.length > 0 && this.user) {
      this.totalCalories = 0;
      if (foodDetail) {
        this.addFoodToMeal();
      }
      this.mealsCaloriesSum();
      this.updateCalories(this.user);
      this.stepsToday = this.days[this.indexDays].steps * 100 / this.user.goals.stepsAtDay;
      this.cdr.detectChanges();
    }
  }

  mealsCaloriesSum() {
    this.totalMealCalories = [];
    let foodExist = false;
    if (this.days) {
      this.days.forEach(day =>
        day.meals.forEach(meal => {
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
        })
      );
    }
  }

  addFoodToMeal() {
    const dia = this.indexDays;
    const comida = JSON.parse(localStorage.getItem('comidaSelected'));
    const foodDetail = JSON.parse(localStorage.getItem('foodDetail'));
    if (this.days && this.days.length > 0) {
      if (!this.days[dia].meals[comida].foods) {
        this.days[dia].meals[comida].foods = [];
      }
      if ((dia != null) && (comida != null) && (foodDetail != null)) {
        this.days[dia].meals[comida].foods.push(foodDetail);
      }
      this.fireService.setUserDietDay(this.fireUser.uid, this.days[this.indexDays], this.indexDays);
      localStorage.removeItem('foodDetail');
      localStorage.removeItem('comidaSelected');
    }
  }
  caloriesBurnedAtDay(user: User): number {

    const fechaNac = new Date(user.birthday);
    const fechaNacMilisec = fechaNac.getMilliseconds();
    const hoy = new Date();
    const hoyMilisec = hoy.getMilliseconds();
    const edad = (hoyMilisec - fechaNacMilisec) / 1000 / 60 / 60 / 24 / 365;

    const tmb = (10 * user.weight) + (6.25 * user.height) - (5 * edad);
    const total = Math.round(tmb * this.activity[user.goals.activityLevel]);

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

  getDateFormat(hoy) {
    const dd = hoy.getDate();
    const mm = hoy.getMonth() + 1; // January is 0!
    const yyyy = hoy.getFullYear();
    let d: string;
    let m: string;
    if (dd < 10) {
      d = '0' + dd.toString;
    } else { d = dd.toString(); }
    if (mm < 10) {
      m = '0' + mm;
    } else { m = mm.toString(); }
    const today = d + '/' + m + '/' + yyyy;
    return today;
  }
  getDaysInMonth(month) {
    const date = new Date(new Date().getFullYear(), month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }


  getDays(year) {
    const result = [];
    for (let i = 0; i < 12; i++) {
      const r = this.getDaysInMonth(i);

      r.forEach(month => {

        const formatted = month.getDate() +
          '/' + (month.getMonth() + 1) + '/' + month.getFullYear();
        result.push(formatted);
      });
    }

    console.log(result);
    return result;
  }
  forwardDay() {
    this.indexDays++;
    if ((this.indexDays >= 1) && (this.indexDays < this.days.length - 1)) {
      this.backArrowValid = true;
    } else {
      this.forwardArrowValid = false;

    }
  }
  rewindDay() {
    this.indexDays--;
    if (this.indexDays < 1) {
      this.backArrowValid = false;
    } else {
      this.forwardArrowValid = true;

    }
  }

  updateUser(user: User) {
    if (user.birthday === undefined) {
      user.birthday = '01-01-1950';
    }
    if (user.height === undefined) {
      user.height = 170;
    }
    if (user.weight === undefined) {
      user.weight = 70;
    }
    if (user.gender === undefined) {
      user.gender = 0;
    }
    if (user.goals === undefined) {
      user.goals = this.goals;
    }
    if (user.units === undefined) {
      user.units = this.units;
    }
    if (user.postalCode === undefined) {
      user.postalCode = '';
    }
    if (user.country === undefined) {
      user.country = 0;
    }
    if (user.name === undefined) {
      user.name = '';
    }
    this.fireService.setUserData(this.fireUser, user);
  }

  updateCalories(user: User) {
    if (this.days[this.indexDays]) {
      const myDay = this.days[this.indexDays];
      myDay.totalCalories = this.totalCalories;
      if (user !== undefined && user !== null) {
        myDay.goalDay = this.caloriesBurnedAtDay(user);
        myDay.weight = this.user.weight;

        this.rest = myDay.goalDay - myDay.totalCalories + myDay.exercise;
        const hoy = new Date();
        if (hoy.getDate() === myDay.date.getDate() &&
            hoy.getFullYear() === myDay.date.getFullYear() &&
            hoy.getMonth() === myDay.date.getMonth()) {
          this.updateDay(myDay, this.indexDays);
        }
      }

    }
  }

  actualizarDiario() {
    this.fireService.getUserDietDays()
      .then(snapshot => {
        let myDays: DietDays[] = [];
        let indexCalendar = 0;
        myDays = snapshot.val();
        myDays.forEach(day => {
          day.date = this.calendar[indexCalendar];
          day.meals.forEach(meal => {
            const myfoods: Food[] = [];
            let myfood: Food;
            if (meal.foods && meal.foods.length > 0) {
              meal.foods.forEach(food => {
                this.fireService.getFoodById(food.id).then(f => {
                  myfood = f;
                  myfood.amount = food.amount;
                  myfoods.push(myfood);
                  meal.foods.slice(0, 1);
                });
              });
              meal.foods = myfoods;
            }
          });
          indexCalendar++;
        });
        this.days = myDays;
        localStorage.setItem('days', JSON.stringify(this.days));

        const hoy = new Date();
        if (this.days && this.days.length > 0) {
          this.diarioDiaActual(hoy);
        } else {
          this.crearMes(hoy);
        }
      });
    // this.dateDay = new Date(this.days[this.indexDays].date);
  }

  crearMes(hoy: Date) {
    const daysCreated = localStorage.getItem('daysCreated');
    if (this.days.length === 0 && daysCreated !== 'true') {
      // creamos todo el mes vacio
      localStorage.setItem('daysCreated', 'true');
      for (let i = 0; i < this.calendar.length; i++) {
        const newDay = { date: this.calendar[i], meals: this.meals, goalDay: 0, totalCalories: 0, exercise: 0, weight: 0, steps: 0 };
        this.days.push(newDay);
        if ((this.calendar[i].getDate() === hoy.getDate()) && (this.calendar[i].getMonth() === hoy.getMonth())) {
          this.today = this.getDateFormat(this.calendar[i]);
          this.indexDays = i;
        }
      }
      this.fireService.setUserDietMonth(this.fireUser.uid, this.days);
    }
  }
  diarioDiaActual(hoy: Date) {
    for (let i = 0; i < this.days.length; i++) {
      if (this.days[i].date) {
        if ((this.days[i].date.getDate() === hoy.getDate()) && (this.days[i].date.getMonth() === hoy.getMonth())) {
          this.today = this.getDateFormat(this.days[i].date);
          this.indexDays = i;
        }
      }
    }
    //  this.fireService.setUserDietDay(this.fireUser.uid, this.day[this.indexDays], this.indexDays);
  }

  private recuperarAlimentos() {
    this.fireService.getFoods()
      .then(snapshot => {
        snapshot.forEach(child => this.foods = child.val());
      });
  }

  private recuperarUsuario() {
    // this.days.push(this.day);
    // this.calendar.push(this.day);
    this.fireService.getUser().then(usu => {
      const user = usu.val();
      if (user == null) {
        this.fireService.createUser(this.fireUser).then(res => {
          const usuario = new User();
          usuario.email = this.fireUser.email;
          this.updateUser(usuario);
        });
      }
    });
  }

  private recuperarInfoUsuario() {
    this.fireService.getUserData().then(user => {
      this.user = user.val();
    });
  }

  private updateDay(dietDays: DietDays, id: number): any {
    this.fireService.setUserDietDay(this.fireUser.uid, dietDays, id);
   }
}