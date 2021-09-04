import { AppState } from '../../app.reducer';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubs!: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}
  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.ingresosEgresosSubs = this.store
      .select('ingresoEgresos')
      .subscribe(({ items }) => (this.ingresosEgresos = items));
  }

  borrar(item: any) {
    this.ingresoEgresoService
      .borrarIngresoEgreso(item.uid || '')
      .then(() => Swal.fire('Borrado','Item borrado','success'))
      .catch( error => Swal.fire('Error',error.message,'error') );
  }
}
