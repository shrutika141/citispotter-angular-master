import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  userProfileData: any = {}
  showOrg: boolean = false;
  alert: boolean = false;
  responseMsg: string;
  userOccupations: any = [];
  selectedUserOccupation: any = 'Select occupation';
  oraganizationLogoUrl:string = '';
  image: any = {};

  shabbir;

  constructor(
    public utilityService: UtilityService,
    private userService: UserService,
    private panelService: PanelService) {
  }

  ngOnInit(): void {
    // Fetching complete user profile data
    this.getUserProfile();

    // Fetching all occupation
    // this.getUserOccupationData();
  }

  // getUserOccupationData() {
  //   console.log("getUserOccupationData called");
  //   this.panelService
  //     .getUserOccupations()
  //     .subscribe(
  //       (data) => {
  //         console.log("getUserOccupationData api response");
  //         console.log('data');
  //         console.log(data);
  //         this.userOccupations = data;
  //         console.log('this.userOccupations');
  //         console.log(this.userOccupations);
  //       },
  //       (error) => {
  //         console.log("getUserOccupationData api error");
  //         console.log(error.message);
  //         this.showErrorAlert(error.message);
  //       });
  // }

  getUserProfile() {
    console.log("getUserProfile called");
    this.panelService
      .getUserProfileData()
      .subscribe(data => {
        console.log("getUserProfileData api response");
        console.log(data);

        // Assigninf api response object to class object
        this.userProfileData = data;

        // Extracting user's occupation an from api response object and storing it in a local variable
        let occupation = this.userProfileData.userOccupationInfo.occupation;

        // Checking which occupation has been selected
        if (occupation == 'Student') {
          $('.student_occupation').removeClass('display_none')
        }
        else if (occupation == 'Organisation Employee') {
          $('.organisation_employee_occupation').removeClass('display_none');
        }

        console.log("this.userProfileData");
        console.log(this.userProfileData);

        this.checkUserRole(this.userProfileData.role);
        console.log('this.userData.org_company_logo');
        if(this.userProfileData.org_company_logo){
          this.oraganizationLogoUrl = this.utilityService.serverBaseUrl + this.userProfileData.org_company_logo;
        }
        console.log(this.userProfileData.org_company_logo);
      });
  }

  // changedOccupation(e) {
  //   console.log("changedOccupation called");

  //   // Firstly hiding the input fields which has a class of student_occupation & organisation_employee_occupation
  //   $('.student_occupation').addClass('display_none');
  //   $('.organisation_employee_occupation').addClass('display_none');

  //   // Extracting the selected field data attribute value
  //   let occupation = $(e.target).find(':selected').data('occupation')
  //   console.log("occupation");
  //   console.log(occupation);

  //   // Checking which occupation has been selected
  //   if (occupation == 'Student') {
  //     $('.student_occupation').removeClass('display_none')
  //   }
  //   else if (occupation == 'Organisation Employee') {
  //     $('.organisation_employee_occupation').removeClass('display_none');
  //   }
  // }

  checkUserRole(role) {
    this.showOrg = role === 'O' ? true : false;
  }

  // Edit Profile Methods
  updateProfile(e) {
    $(e.target).prop("type", "submit");
    $('#profileForm').toggleClass('ds_none');
    $('#editProfileForm').toggleClass('ds_none');
    $('#username').focus();
    this.goToTop();
    $('#updateProfileBtn').toggleClass('ds_none');
    // $('#editProfileBtn').toggleClass('ds_none');
  }

  onSubmit() {
    let data = this.userProfileData;
    console.log(data);

    data.last_login = this.userService.userData.login_time;
    data.id = this.userService.userData.id;

    this.panelService
      .editUserProfileData(data)
      .subscribe(
        (data) => {
          console.log('Edit profile response.');
          console.log(data.data);

          this.userProfileData = data.data;

          // this.oraganizationLogoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdw8Z-dOgc9IXrW7zX12rkL0ZrcjhMdhIRUw&usqp=CAU";

          // if(this.userProfileData.org_company_logo){
            // this.oraganizationLogoUrl = "http://localhost:3000/public/uploads/images/1626499802153-hk_logo.png";
            this.oraganizationLogoUrl = "http://localhost:3000/public/uploads/images/1626499802153-hk_logo2.png";
            console.log("this.oraganizationLogoUrl");
            console.log(this.oraganizationLogoUrl);
          // }


          this.userService.saveUserDataLocal(data.data);

          if (data.msg == 'success') {
            this.showSuccessAlert();
          } else {
            this.showErrorAlert(data);
          }
          this.goToTop();
        });
  }

  showErrorAlert(errorMsg) {
    this.alert = true;
    this.responseMsg = errorMsg;
    if ($("#topScrollAnchor").hasClass('myalert')) {
      $("#topScrollAnchor").removeClass("myalert");
    }
  }

  showSuccessAlert() {
    Swal.fire('Success..', '<b>Profile updated successfully..</b>', 'success');
    $('#profileForm').toggleClass('ds_none');
    $('#editProfileForm').toggleClass('ds_none');
    $('#updateProfileBtn').toggleClass('ds_none');
    $('#editProfileBtn').toggleClass('ds_none');
  }

  imagePreview(event: any) {
    this.userProfileData.org_company_logo = event.target.files[0];
    console.log(event.target.files[0]);
    // return;
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      if (filesAmount) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          // console.log(event.target.result);
          this.image = (event.target.result);

          // this.userProfileData.org_company_logo = this.image;
        }

        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  goToTop() {
    const elem = (document.getElementById("moveTop")) as HTMLSpanElement;;
    elem.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  closeAlert() {
    $('#topScrollAnchor').toggleClass("myalert");
  }
}
