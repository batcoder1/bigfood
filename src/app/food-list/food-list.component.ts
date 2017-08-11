import { ActivatedRoute } from '@angular/router';
import { EventService } from './../providers/event.service';
import { ActiveStateService } from './../providers/active-state.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { FireService } from './../providers/fire.service';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { Food } from '../data-model';


@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['food-list.component.css']

})
export class FoodListComponent implements OnInit {

  foods: FirebaseListObservable<Food[]>;
  isLoading = false;
  selectedFood: Food;
  private sub: any;

  constructor(private fireService: FireService, private activeStateService: ActiveStateService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getFoods();
  }

  getFoods() {
    this.isLoading = true;
    this.foods = this.fireService.foods;
    this.selectedFood = undefined;
  }

  select(food: Food) {
    this.selectedFood = food;
  }

}
