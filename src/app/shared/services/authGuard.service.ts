import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private readonly returner: Router, private authService: AuthService) {

  }

  /**
   * authGuard will protec those routes.
   * canActivate will check if user is authenticated. If not, user will be returned to login page.
   * If a user is flagged as admin, he can only access admin panel. If user is not flagged as admin, user can only access home (user) panel.
   * @param route Route
   * @param state State
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      switch (route.routeConfig.path) {
        case 'admin':
          return currentUser.admin;
        case 'home':
          return !currentUser.admin;
        default:
          this.router.navigate(['**']);
          return false;
      }
    } else {
      this.authService.logout();
      return false;
    }
  }
}
