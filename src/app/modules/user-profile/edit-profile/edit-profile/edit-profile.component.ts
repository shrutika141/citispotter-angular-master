import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
declare var $: any;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  alert: boolean = false;
  responseMsg: string;
  userData: any = {}
  userRoles: any = [];
  logo: any = {};
  showOrg: boolean = false;

  constructor(private panel: PanelService,
    private routes: Router,
    public util: UtilityService,
    private user: UserService) {
  }

  ngOnInit(): void {
    this.getAllUserRoles();
    this.getUserProfile();
  }

  getUserProfile() {
    this.panel.getUserProfileData().subscribe(data => {
      if (data) {
        console.log('getUserProfile() data');
        console.log(data);
        this.userData = data;
        this.checkUserRole(this.userData.role)
      }
    });
  }

  checkUserRole(role) {
    this.showOrg = role == 'O' ? true : false;
  }

  onSubmit(data) {
    data.last_login = this.user.userData.login_time;
    data.id = this.user.userData.id;
    this.userData = data;
    if (this.userData.role != "O") {
      console.log('inside if');
      data.org_contact_name = null;
      data.org_contact_email = null;
      data.org_contact_number = null;
      data.org_company_tax_id = null;
      data.org_company_logo = null;
    } else {
      console.log('inside else');
      data.org_company_logo = this.userData.org_company_logo;
    }
    this.panel
    .editUserProfileData(data)
    .subscribe(ans => {
      console.log('Edit profile response.');
      console.log(ans);
      if (ans == 'success') {
        this.routes.navigate(['profile']);
      } else {
        this.alert = true;
        this.responseMsg = ans;
        this.goToTop();
        if ($("#topScrollAnchor").hasClass('myalert')) {
          $("#topScrollAnchor").removeClass("myalert");
        }
      }
    });
  }

  getAllUserRoles() {
    this.panel.getUserRoles().subscribe(data => {
      this.userRoles = data;
    });
  }

  imagePreview(e) {
    console.log(e.target.files[0]);
    this.userData.org_company_logo = e.target.files[0]

    const previewContainer = (document.getElementById("imagePreview")) as HTMLDivElement;
    const previewImage = (previewContainer.querySelector(".image-preview__image")) as HTMLImageElement;
    const previewDefaultText = (previewContainer.querySelector(".image-preview__default-text")) as HTMLSpanElement;

    var file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      previewDefaultText.style.display = "none";
      previewImage.style.display = "block";

      reader.addEventListener("load", function () {
        previewImage.setAttribute("src", this.result as string);
      });
      reader.readAsDataURL(file);
    } else {
      previewDefaultText.style.display = null;
      previewImage.style.display = null;
      previewImage.setAttribute("src", "");
    }
  }

  goToTop() {
    const elem = (document.getElementById("moveTop")) as HTMLSpanElement;;
    console.log(elem);
    elem.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  closeAlert() {
    $('#topScrollAnchor').toggleClass("myalert");
  }
}
