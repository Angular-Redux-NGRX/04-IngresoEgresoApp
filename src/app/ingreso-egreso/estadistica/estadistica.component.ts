import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  ingresos: number = 0;
  egresos: number = 0;
  totalIngresos: number = 0;
  totalEgresos: number = 0;
  ingresosEgresosSubs!: Subscription;
  constructor(private store: Store<AppState>) {}
    // Doughnut
    public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos',];
    public doughnutChartData: MultiDataSet = [[]];
    public doughnutChartType: ChartType = 'doughnut';

  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.ingresosEgresosSubs = this.store
      .select('ingresoEgresos')
      .subscribe(({ items }) => this.generarEstadistica(items));
  }
  generarEstadistica(items: IngresoEgreso[]) {
    this.totalIngresos = 0;
    this.totalEgresos = 0;
    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }

    this.doughnutChartData = [[this.totalIngresos,this.totalEgresos]];
  }
}
