import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PanelService } from '../panel/panel.service';

import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData: any = {};
  userFcmToken: string = '';
  localUserDataKey = "userData";
  timeoutId: null | ReturnType<typeof setTimeout> = null

  constructor(
    private router: Router,) {
    this.getUserData();
  }

  isUserLogin() {
    console.log('isUserLogin called.');
    return Object.keys(this.userData).length ? true : false;
  }
  saveUserDataLocal(value) {
    if (value) {
      let str = JSON.stringify(value);
      localStorage.setItem(this.localUserDataKey, str);
      this.getUserData();
    }
  }
  getUserData() {
    // console.log("getUserData called.");
    let data = localStorage.getItem(this.localUserDataKey);

    if (data) {
      let obj = JSON.parse(data);
      this.userData = obj;
      return obj;
    } else {
      return {};
    }
  }
  logout() {
    this.userData = {};
    this.userFcmToken = '';
    this.timeoutId = null;
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  stopUpdatingUserPageSpendTime() {
    console.log("stopUpdatingUserPageSpendTime called");
    console.log("this.timeoutId");
    console.log(this.timeoutId);

    clearInterval(this.timeoutId);
  }
  checkUserRole() {
    return this.userData.role === "D" ? "License" : "Subscription";
  }
}
