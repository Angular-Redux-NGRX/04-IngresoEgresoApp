import { AppState } from '../app.reducer';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  authSubs!: Subscription;
  ingresoEgresosServiceSubs!: Subscription;
  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnDestroy(): void {
    this.authSubs?.unsubscribe();
    this.ingresoEgresosServiceSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.authSubs = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe((auth) => {
        //console.log(auth);
        this.ingresoEgresosServiceSubs = this.ingresoEgresoService
          .initIngresoEgresoListener(auth.user?.uid)
          .subscribe((ingresosEgresosFB) => {
            this.store.dispatch(
              ingresoEgresoActions.setItems({ items: ingresosEgresosFB })
            );
          });
      });
  }
}
