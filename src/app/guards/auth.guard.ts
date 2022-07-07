import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private us: UserService) { }
  canActivate(): boolean {
    if (this.us.isUserLogin()) {
      // console.log('inside this.us.isUserLogin() if');
      this.router.navigateByUrl('/homepage');
      return false;
    } else {
      // console.log('inside this.us.isUserLogin() else');
      return true;
    }
  }

}
