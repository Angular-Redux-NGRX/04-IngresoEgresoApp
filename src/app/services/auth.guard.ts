import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate,CanLoad {
  constructor(private authService: AuthService, private router: Router) {}


  canLoad():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.isAuth().pipe(
      tap((estado) => {
        if (!estado) {
          this.router.navigate(['/login']);
        }
      }),
      take(1)
    );
  }


  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.isAuth().pipe(
      tap((estado) => {
        if (!estado) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
