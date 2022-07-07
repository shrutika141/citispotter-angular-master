import { Component, OnInit } from '@angular/core';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import * as moment from 'moment';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {

  userData: any;

  constructor(
    public userService: UserService,
    private panelService: PanelService,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void { }

  logoutUser() {
    console.log('logoutUser called.');

    //Removing user's fcm token
    this.panelService
      .deleteUserFcmToken()
      .subscribe(
        (data) => {
          console.log('User token deleted successfully.', data);
        },
        (error) => {
          console.log('deleteUserFcmToken api error', error);
        }
      );

    //User logout_time  storing in the database
    let userActivity = {
      user_id: this.userService.userData.id,
      login_time: this.userService.userData.login_time,
      logout_time: moment().format(this.utilityService.dbDateTimeFormat),
      visited_page: '/login',
      visited_page_time: moment().format(this.utilityService.dbDateTimeFormat),
    };

    this.panelService
      .setUserActivityData(userActivity)
      .subscribe((data) => console.log('User logout successfully.', data));

    //stop the timeout interval which has been used to store the record of user page spend time
    this.userService.stopUpdatingUserPageSpendTime();

    // Finally logging out the user
    this.userService.logout();
  }

  keyCheck() {
    this.userService.checkUserRole();
  }
}
