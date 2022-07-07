import { Component, OnInit } from '@angular/core';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData: any = {};
  userDataAvailable: boolean = false;

  constructor(
    private panel: PanelService,
    private util: UtilityService,
    public userService: UserService
  ) { }

  url: string = this.util.baseUrl;
  showLogo: any;

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile() {
    this.panel
      .getUserProfileData()
      .subscribe((data) => {
        if (data) {
          this.userData = data;
          console.log('userData');
          console.log(this.userData);
          console.log(this.userData.userRoleInfo.name);
          this.userDataAvailable = true;
          this.showLogo = this.userData.org_company_logo ? true : false;
        }
      },
        (error) => {
          console.log("getUserProfileData api error");
          console.log(error);
          Swal.fire({
            title: `<p class='swalText'>Process failed..</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        });
  }
}
