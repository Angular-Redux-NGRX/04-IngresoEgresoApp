import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as authActions from '../auth/auth.actions';
import { Usuario } from '../models/usuario.model';
import * as uiActions from '../shared/ui.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseUser!:Subscription;
  private _user!:Usuario | null;

  get user(){
    return { ...this._user };
  }

  constructor(public auth: AngularFireAuth,
              public firestore:AngularFirestore,
              private store:Store) { }

  initAuthListener(){
    this.auth.authState.subscribe( fuser =>{
      //console.log(fuser);
      if(fuser){
        //existe
        this.firebaseUser = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe( (firestoreUser:any) => {
          const user = Usuario.fromFirebase(firestoreUser);
          this._user = user;
          this.store.dispatch(authActions.setUser({ user }));
        });
      }else{
        //no existe
        this._user = null;
        this.firebaseUser.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  crearUsuario(nombre:string,email:string,password:string){
    return this.auth.createUserWithEmailAndPassword(email,password)
    .then( ( fuser ) => {
      const newUser = new Usuario( fuser.user!.uid, nombre, email );
      return this.firestore.doc(`${fuser.user?.uid}/usuario`).set( Object.assign({}, newUser) );
    });
  }

  loginUsuario(email:string,password:string){
    return this.auth.signInWithEmailAndPassword(email,password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fuser => fuser != null )
    );
  }
}
