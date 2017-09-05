import { DietDays, User } from './../data-model';
import { FireService } from '../providers/fire.service';
import { Component, OnInit } from '@angular/core';

class Data {
  type: string;
  value: number;
}

@Component({
  selector: 'app-progress-page',
  templateUrl: './progress-page.component.html',
  styleUrls: ['./progress-page.component.css']
})
export class ProgressPageComponent implements OnInit {
  fireService: FireService;
  user: User;
  days: DietDays[];
  typeData = ['weight', 'exercise', 'totalCalories'];
  valueData = 0;
  lineChartData = [{ data: [], label: '' }];
  label = '';
  lineChartLabels: Array<any> = [];
  lineChartOptions: any = { responsive: true };
  data: Data;
  periodo: Data;
  lineChartLegend = false;
  lineChartType = 'line';

  constructor(fireService: FireService) {
    this.fireService = fireService;
  }
  ngOnInit() {
    this.data = { type: 'weight', value: 0 };
    this.periodo = { type: 'semana', value: 0 };
    this.fireService.getUserData().then(user => {
      this.user = user.val();
      this.loadChart();
    });
  }
  loadChart() {
    this.days = JSON.parse(localStorage.getItem('days'));
    this.days.forEach((day, index) => {
      this.lineChartData[this.valueData].data.push(day[this.typeData[this.data.value]]);
      const date = new Date(day.date);
      this.lineChartLabels.push(date.getDay() + '/' + date.getMonth());
    });
  }
  // events
  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }

  updateData(type, value) {
    this.data.type = type;
    this.data.value = value;
    this.loadChart();
  }
  updatePeriodo(type, value) {
    this.periodo.type = type;
    this.periodo.value = value;
  }
}

