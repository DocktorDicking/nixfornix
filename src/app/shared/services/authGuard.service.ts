import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const sessionUser = this.authService.getSession();
    if (sessionUser) {
      if (route.outlet === '/admin') {
        return (sessionUser.admin);
      }
    }

    return false;
  }


}
