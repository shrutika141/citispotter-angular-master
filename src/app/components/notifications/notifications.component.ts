import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  userNotificationData: any = [];

  constructor(
    private panelService: PanelService,
    public userService: UserService,
    public utilityService: UtilityService,
    private loaderService: LoaderService,
    public routes: Router) { }

  ngOnInit(): void {
    // this.utilityService.isNewNotification = false;
    this.getUserNotficationData();
  }

  getUserNotficationData() {
    console.log('getUserNotficationData called');
    this.loaderService.showLoading('custom_loading_outer1');
    this.panelService
      .getUserAllNotifications()
      .subscribe(data => {
        this.loaderService.hideLoading('custom_loading_outer1');
        console.log('getUserAllNotifications api response');
        console.log(data);
        data = data.data;
        if (Array.isArray(data)) {
          console.log('inside userNotificationData if');
          this.userNotificationData = data;
        } else {
          console.log('inside userNotificationData else');
          this.userNotificationData.push(data);
        }
      },
      (error) => {
        console.log("getUserAllNotifications api error");
        console.log(error);
        this.loaderService.hideLoading('custom_loading_outer1');
        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      });
  }

}
