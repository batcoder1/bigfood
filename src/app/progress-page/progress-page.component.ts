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
    const milisegAtDay = 1000 * 3600 * 24;
    this.days = JSON.parse(localStorage.getItem('days'));
    this.lineChartData[this.valueData].data = [];
    this.lineChartLabels = [];
    if (this.days && this.days.length > 0) {

      this.days.forEach((day, index) => {
        const today = new Date();
        let inicioPeriodo;
        if (this.periodo.type === 'semana') {
          inicioPeriodo = new Date(today.getTime() - (milisegAtDay * 7));

        } else if (this.periodo.type === 'mes') {
          if (this.periodo.value === 1) {
            // 1mes
            inicioPeriodo = new Date(today.getTime() - (milisegAtDay * 30));

          } else if (this.periodo.value === 2) {
            // 3meses
            inicioPeriodo = new Date(today.getTime() - (milisegAtDay * 30 * 3));
          } else {
            // 6meses
            inicioPeriodo = new Date(today.getTime() - (milisegAtDay * 30 * 6));
          }
        } else if (this.periodo.type === 'anno') {
          if (this.periodo.value === 4) {
            // 1anno
            inicioPeriodo = new Date(today.getTime() - (milisegAtDay * 30 * 12));

          } else {
            // 3annos
            inicioPeriodo = new Date(today.getTime() - (milisegAtDay * 30 * 12 * 3));
          }
        }
        const date = new Date(day.date);
        if (inicioPeriodo <= date && date <= today) {
          this.lineChartData[this.valueData].data = [...this.lineChartData[this.valueData].data, day[this.typeData[this.data.value]]];
          this.lineChartData[this.valueData].label = this.data.type;
          const mes = new Date(day.date).getMonth() + 1;
          this.lineChartLabels = [...this.lineChartLabels, date.getDate() + '/' + mes];

        }
      });
    }
  }

  updateData(type, value) {
    this.data.type = type;
    this.data.value = value;
    this.loadChart();

  }
  updatePeriodo(type, value) {
    this.periodo.type = type;
    this.periodo.value = value;
    this.loadChart();
  }



}

