import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private readonly returner: Router, private authService: AuthService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const sessionUser = this.authService.getSession();
    if (sessionUser) {
      if (route.routeConfig.path === 'admin') {
        if (!sessionUser.admin) {
          this.router.navigate(['home']);
          return false;
        }
        return (sessionUser.admin);
      }
      if (route.routeConfig.path === 'home') {
        if (sessionUser.admin) {
          this.router.navigate(['admin']);
          return false;
        }
        return true;
      }
    }
    this.router.navigate(['login']);
    return false;
  }
}
