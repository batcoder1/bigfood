import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Food, Macros , units} from './data-model';


@Component({
  selector: 'app-food-update',
  template: ''
 // templateUrl: './food-update.component.html'
})
export class FoodUpdateComponent implements OnChanges {
  @Input() food: Food;

  foodForm: FormGroup;
  units = units;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.foodForm = this.fb.group({
      name: ['', Validators.required ],
      description: ['', Validators.required ],
      amount: [ 0 , Validators.required ],
      unit: ['', Validators.required ],
      calories: [ 0 , Validators.required ],
      macros: this.fb.group(new Macros()) // <-- a FormGroup with a new Macros
    });
  }

  ngOnChanges() {
    this.foodForm.reset({
      name: this.food.name,
      description: this.food.description,
      amount: this.food.amount,
      unit: this.food.unit,
      calories: this.food.calories,
      macros: this.food.macros || new Macros()
    });
  }

}
