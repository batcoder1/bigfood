import { FireService } from '../providers/fire.service';
import { ActivatedRoute } from '@angular/router';
import { Units } from './../data-model';
import { DialogComponent } from './../dialog/dialog.component';
import { MdDialog } from '@angular/material';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Food, Macros , units} from '../data-model';


@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html'
})
export class FoodDetailComponent implements OnInit, OnDestroy  {
  food: Food;
  id: number;
  units = units;
  selectedOption: string;
  todoList: any = [];
  okButtonText = 'Create task';
  sub: any;

  constructor(public dialog: MdDialog,
    private route: ActivatedRoute,
    private fireService: FireService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = +params['id']; // (+) converts string 'id' to a number

       // In a real app: dispatch action to load the details here.
    });
    this.fireService.getFoodById(this.id).then(food => this.food = food);
  }

   openDialog(food) {
    const dialogRef = this.dialog.open(DialogComponent, {data: food});
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }

   ngOnDestroy() {
    this.sub.unsubscribe();
  }
}