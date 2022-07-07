import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class OuterGuard implements CanActivate {
  constructor(private router: Router,private userService: UserService) { }
  canActivate(): boolean {
    if (this.userService.isUserLogin()) {
      // console.log(this.us.isUserLogin());
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
