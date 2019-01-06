import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from "../../categories/shared/category.service";

import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from "../../entries/shared/entry.service";

import * as currencyFormatter from "currency-formatter";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  ChartOptions = {
    scale: {
      yAxes: [ { beginAtZero: true } ]
    }
  }

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe(c => this.categories = c);
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if(!month || !year) {
      alert('Você precisa selecionar o mês e o ano para gerar os relatórios.');
    } else {
      this.entryService.getMonthAndYear(month, year)
        .subscribe(this.setValues.bind(this));
    }
  }

  private setValues(entries: Entry[]) {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(e => {
      if(e.type == 'revenue') {
        revenueTotal += currencyFormatter.unformat(e.amount, {code: 'BRL'});
      } else {
        expenseTotal += currencyFormatter.unformat(e.amount, {code: 'BRL'});
      }
    });

    this.expenseTotal = currencyFormatter.format(expenseTotal, {code: 'BRL'});
    this.revenueTotal = currencyFormatter.format(revenueTotal, {code: 'BRL'});
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, {code: 'BRL'});
  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#E03131');
  }

  private getChartData(entryType: string, title: string, color: string) {
    const chartData = [];
    this.categories.forEach(c => {
      // Filtering entries by category and type.
      const filteredEntries = this.entries.filter(
        e => (e.categoryId == c.id) && (e.type == entryType)
      );
      // If found entries, then sum entries amount add to chartData
      if(filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce(
          (t, e) => t + currencyFormatter.unformat(e.amount, {code:'BRL'}), 0
        );
        chartData.push({
          categoryName: c.name,
          totalAmount: totalAmount
        });
      }
    });

    return {
      labels: chartData.map(v => v.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(v => v.totalAmount)
      }]
    }
  }

}
