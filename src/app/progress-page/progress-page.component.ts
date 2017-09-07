import { DietDays, User } from './../data-model';
import { FireService } from '../providers/fire.service';
import { AfterViewInit, Component, OnInit, OnChanges } from '@angular/core';

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
  // public lineChartData: Array<any> = [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //   {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
  //   {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  // ];
  label = '';
  lineChartLabels: Array<any> = [];
  lineChartOptions: any = { responsive: true };
  data: Data;
  periodo: Data;
  lineChartLegend = true;
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
      const today = new Date();
      const date = new Date(day.date);
      if (date <= today) {
        this.lineChartData[this.valueData].data = [...this.lineChartData[this.valueData].data, day[this.typeData[this.data.value]]];
        this.lineChartData[this.valueData].label = this.data.type;
        this.lineChartLabels = [...this.lineChartLabels, date.getDate() + '/' + date.getMonth() + 1];

      }
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

