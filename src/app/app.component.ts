import { Component, OnInit } from '@angular/core';
import { NavigationStart, NavigationEnd, Router, ActivationStart, ActivationEnd } from '@angular/router';
import * as moment from 'moment';
import { MessagingService } from './services/messaging/messaging.service';
import { PanelService } from './services/panel/panel.service';
import { UserService } from './services/user/user.service';
import { UtilityService } from './services/utility/utility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'citispotter-angular';

  hideHeaderComponent: boolean = true;
  hideSidenavComponent: boolean = true;
  hideFooterComponent: boolean = true;
  message;
  userLastActitvityId: number;
  userLastActitvityData: any = {};
  isTrackUserActivity: boolean = false;

  constructor(private router: Router,
    private userService: UserService,
    private panelService: PanelService,
    private utilityService: UtilityService,
    private messagingService: MessagingService) {
  }

  ngOnInit() {
    console.log("AppComponent ngOnInit called");
    this.fetchUserIpAddress();
    this.trackUserActivity();
    // this.utilityService.clearConsole();
  }

  fetchUserIpAddress() {
    console.log("fetchUserIpAddress called");
    this.utilityService
      .getUserIp()
      .then(data => {
        console.log('Ip data');
        console.log(data);
        this.utilityService.saveUserIpAddress = data;
        console.log("this.userIpAddress");
        console.log(this.utilityService.saveUserIpAddress);
      });
  }

  updateUserPageSpendTime() {
    console.log("updateUserPageSpendTime called");
    let val = setInterval(() => {

      // Checking whether ip is saved in local storage or not with userData if not then fetch and save
      let getIp = null;
      if (this.userService.userData.ip) {
        getIp = this.userService.userData.ip
      }
      else if (this.utilityService.saveUserIpAddress && this.utilityService.saveUserIpAddress.ip) {
        getIp = this.utilityService.saveUserIpAddress.ip;
      }

      let userActivity = {
        id: this.userLastActitvityId,
        spend_time: +this.userLastActitvityData.spend_time + 5,
        ip: getIp
      }
      this.panelService
        .setUserPageSpendTime(userActivity)
        .subscribe(data => {
          console.log("setUserPageSpendTime api response.");
          console.log(data);
          this.userLastActitvityData.spend_time = userActivity.spend_time;
        });
    }, 5000);

    console.log('setInterval id');
    console.log(val);
    this.userService.timeoutId = val;
  }

  trackUserActivity() {
    console.log("trackUserActivity called");
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        // The below code is checking whether any data is coming from activated route or not
        this.hideHeaderComponent = event.snapshot.data.header == false ? event.snapshot.data.header : true;
        this.hideSidenavComponent = event.snapshot.data.sidenav == false ? event.snapshot.data.sidenav : true;
        this.hideFooterComponent = event.snapshot.data.footer == false ? event.snapshot.data.footer : true;
        this.isTrackUserActivity = event.snapshot.data.trackActivity == false ? event.snapshot.data.trackActivity : true;
      }

      // if (event instanceof NavigationEnd) {
      //   console.log('inside NavigationEnd');
      //   console.log(event.url);

      //   // The below code is inserting user's every route activity excluding login page route
      //   if (this.isTrackUserActivity) {
      //     console.log("this.userService.userData.ip");
      //     console.log(this.userService.userData.ip);

      //     // Checking whether ip is saved in local storage or not with userData if not then fetch and save
      //     let getIp = null;
      //     if (this.userService.userData.ip) {
      //       console.log('if se mil ip');
      //       getIp = this.userService.userData.ip
      //     }
      //     else if (this.utilityService.saveUserIpAddress && this.utilityService.saveUserIpAddress.ip) {
      //       console.log('else if se mil ip');
      //       getIp = this.utilityService.saveUserIpAddress.ip;
      //     }

      //     let userActivity = {
      //       user_id: this.userService.userData.id,
      //       login_time: this.userService.userData.login_time,
      //       logout_time: null,
      //       visited_page: event.url,
      //       visited_page_time: moment().format(this.utilityService.dbDateTimeFormat),
      //       spend_time: 5,
      //       ip: getIp
      //     }

      //     this.panelService
      //       .setUserActivityData(userActivity)
      //       .subscribe(data => {
      //         console.log('User activity response.');
      //         console.log(data);

      //         // once the user route activity data is stored now how long user spend time on particular page will track
      //         this.userLastActitvityId = data.data.id;
      //         this.userLastActitvityData = data.data;
      //         console.log("this.userService.timeoutId");
      //         console.log(this.userService.timeoutId);

      //         //setInterval only once when timeoutId is having null
      //         if (this.userService.timeoutId == null) {
      //           console.log('timeoutId null ho gaya.');
      //           this.updateUserPageSpendTime();
      //         }
      //       });
      //   }
      // }
    });
  }
}
