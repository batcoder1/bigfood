import { FireService } from '../providers/fire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Units } from './../data-model';
import { DialogComponent } from './../dialog/dialog.component';
import { MdDialog } from '@angular/material';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Food, Macros, units } from '../data-model';


@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.css']

})
export class FoodDetailComponent implements OnInit, OnDestroy {
  food: Food;
  id: number;
  units = units;
  selectedOption: string;
  todoList: any = [];
  okButtonText = 'Create task';
  sub: any;
  color = 'primary';
  mode = 'determinate';
  porcentaje = { protein: 0, fat: 0, hc: 0 };
  isDeterminate = true;
  inicioProtein = '';
  inicioFat = '';
  hcGrades = 0;
  proteinGrades = 0;
  proteinHcSumGrades = 0;
  constructor(public dialog: MdDialog,
    private route: ActivatedRoute,
    private router: Router,
    private fireService: FireService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
    });
    this.fireService.getFoodById(this.id).then(food => {
      this.food = food;
      this.calculoPorcentaje();

    });
  }

  openDialog(food) {
    const dialogRef = this.dialog.open(DialogComponent, { data: food });
    dialogRef.afterClosed().subscribe(foodDetail => {
      this.selectedOption = foodDetail;
      localStorage.setItem('foodDetail', JSON.stringify(food));
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  calculoPorcentaje() {
    const fat = this.food.macros.fat;
    const protein = this.food.macros.protein;
    const hc = this.food.macros.hc;
    const totalgrs = fat + protein + hc;
    this.porcentaje.fat = Math.round(fat * 100 / totalgrs);
    this.porcentaje.protein = Math.round(protein * 100 / totalgrs);
    this.porcentaje.hc = Math.round(hc * 100 / totalgrs);

    this.hcGrades = this.toGrades(this.porcentaje.hc);
    this.proteinGrades = Math.round(this.toGrades(this.porcentaje.protein));

    this.inicioProtein = 'rotate(' + this.hcGrades + 'deg)';
    const proteinHcSum =  (this.porcentaje.protein + this.porcentaje.hc);
    this.proteinHcSumGrades = Math.round(this.toGrades(proteinHcSum));
    this.inicioFat = 'rotate(' + this.proteinHcSumGrades + 'deg)';
  }
  toGrades(porcentaje): number {
    return porcentaje * 360 / 100;
  }
  getStartProtein(){
    return 'transform: rotate(' + this.hcGrades + 'deg)';
  }
}