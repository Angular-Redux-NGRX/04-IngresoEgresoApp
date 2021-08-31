import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription, timer } from 'rxjs';
import * as ui from '../../shared/ui.actions';
import { timeInterval } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})


export class RegisterComponent implements OnInit,OnDestroy {


  registroForm!: FormGroup;
  uiSubscription!: Subscription;
  cargando:boolean = false;

  constructor( private fb:FormBuilder,
               private authService:AuthService,
               private store: Store<AppState>,
               private router: Router) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre:['',Validators.required],
      email:['',[Validators.required, Validators.email]],
      password:['',Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    });
  }
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    if(this.registroForm.invalid){ return; }
    this.store.dispatch(ui.isLoading());
/*     Swal.fire({
      title: 'Cargando',
      didOpen: () => {
        Swal.showLoading()
      }
    }); */
     const { nombre, email, password } = this.registroForm.value;
     this.authService.crearUsuario(nombre,email,password)
       .then( credenciales =>{
         console.log(credenciales);
         //Swal.close();
         this.store.dispatch(ui.stopLoading());

         this.router.navigate(['/']);
       } ).catch( error => {
        this.store.dispatch(ui.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          })
       } )
  }

}
