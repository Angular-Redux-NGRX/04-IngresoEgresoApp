import * as ui from '../shared/ui.actions';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy{

  ingresoForm!: FormGroup;
  tipo:string='ingreso';
  cargando = false;
  uiSubscription!:Subscription;
  constructor(private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store:Store<AppState>) { }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion:['',[Validators.required]],
      monto:['',[Validators.required]],
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui =>{
      this.cargando = ui.isLoading;
    });
  }

  guardar(){
    this.store.dispatch( ui.isLoading());
    setTimeout(() => {
      // cancelar loading
      this.store.dispatch( ui.stopLoading());
    }, 2500);
    return;
    console.log(this.ingresoForm.value);
    console.log(this.tipo);
    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
    .then(() => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Creado correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      this.ingresoForm.reset();
    }).catch( (error)=> {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      })
    } );
  }

}
