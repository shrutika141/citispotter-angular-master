import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from "angularx-social-login";
declare var $: any;
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  alert: boolean = false;
  responseMsg: string;
  userOccupations: any = [];
  selectedUserOccupation: any = 'Select occupation';
  // userRoles: any = [];
  // userRole: any = "D";
  constructor(
    private authService: AuthService,
    private router: Router,
    private panelService: PanelService,
    private userService: UserService,
    private utilityService: UtilityService
    // private socialAuthService: SocialAuthService
  ) {
  }

  ngOnInit(): void {

    // this.getAllUserRoles();

    // Fetching all user's occupation data
    this.getUserOccupationData();
  }

  // getAllUserRoles() {
  //   this.panel.getUserRoles().subscribe(data => {
  //     console.log('data');
  //     console.log(data);
  //     this.userRoles = data;
  //     console.log('this.userRoles');
  //     console.log(this.userRoles);
  //   });
  // }

  getUserOccupationData() {
    console.log("getUserOccupationData called");
    this.panelService
      .getUserOccupations()
      .subscribe(
        (data) => {
          console.log("getUserOccupationData api response");
          console.log('data');
          console.log(data);
          this.userOccupations = data;
          console.log('this.userOccupations');
          console.log(this.userOccupations);
        },
        (error) => {
          console.log("getUserOccupationData api error");
          console.log(error.message);
          this.showErrorAlert(error.message);
        });
  }

  onSubmit(data) {
    console.log('Keep Calm John.');
    console.log(data);

    // The below line will hide the error alert box
    this.alert = false;

    console.log(data.password);
    console.log(data.confirm_password);

    // The below code is checking whether the password & confirm password are empty or not
    if (!data.password || !data.confirm_password) {
      this.showErrorAlert('Password and Confrim both are mandatory fields.');
      return;
    }

    // The below code is checking whether the password & confirm password are same or not
    if (data.confirm_password !== data.password) {
      const errorText = "Password and Confirm Password fields don't match.Please try again."
      this.showErrorAlert(errorText);
      return;
    }

    // The below code is checking password strength if week found then it will kill the register process
    let passwordStrengthStatus = $('.password_indicator .medium').hasClass('active');
    console.log("passwordStrengthStatus");
    console.log(passwordStrengthStatus);
    if (!passwordStrengthStatus) {
      this.showErrorAlert('Poor password.Improve password to register');
      return;
    }

    console.log('success');

    if (data.user_occupation_id == "Select occupation") { data.user_occupation_id = '' }

    // The below code will show loading till api call response
    $('.register_loader').toggleClass('display_none');
    $('#registerBtn').toggleClass('pointer_events_none');

    this.authService
      .register(data)
      .subscribe(ans => {

        // The below code will hide loading
        $('.register_loader').toggleClass('display_none');
        $('#registerBtn').toggleClass('pointer_events_none');

        console.log('userData ans');
        console.log(ans);

        // The below code will analysing api response if success move forward otherwise it will show alert
        if (ans.msg == 'success') {
          console.log('ans.data');
          console.log(ans.data);
          let login_time = moment().format(this.utilityService.dbDateTimeFormat);
          ans.data.login_time = login_time;
          ans.data.ip = this.utilityService.saveUserIpAddress && this.utilityService.saveUserIpAddress.ip ? this.utilityService.saveUserIpAddress.ip : null;
          this.userService.saveUserDataLocal(ans.data);
          this.router.navigate(['homepage']);
        } else {
          this.showErrorAlert(ans);
        }
      }, err => {
        console.log("register api error");
        console.log(err);
        $('.register_loader').toggleClass('display_none');
        $('#registerBtn').toggleClass('pointer_events_none');
        Swal.fire({
          title: `<p class='swalText'>Process failed..</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      });
  }

  // signUpWithGoogle(): void {
  //   this.socialAuthService
  //     .signIn(GoogleLoginProvider.PROVIDER_ID)
  //     .then(data => {
  //       console.log("google sign-in data");
  //       console.log(data);
  //       let userObj = {
  //         name:data.name,
  //         email:data.email,
  //         google_id:data.id,
  //         social_login_type:'google'
  //       }
  //       this.onSubmit(userObj);
  //     }).catch(error => {
  //       console.log("google sign-in error");
  //       console.log(error);
  //     });
  // }

  // signUpWithFB(): void {
  //   this.socialAuthService
  //   .signIn(FacebookLoginProvider.PROVIDER_ID)
  //   .then(data => {
  //     console.log("facebook data");
  //     console.log(data);
  //     let userObj = {
  //       name:data.name,
  //       email:data.email,
  //       facebook_id:data.id,
  //       social_login_type:'facebook'
  //     }
  //     this.onSubmit(userObj);
  //   }).catch(error => {
  //     console.log("facebook error");
  //     console.log(error);
  //   });
  // }

  // signOut(): void {
  //   this.socialAuthService.signOut();
  // }

  closeErrorAlertBox() {
    this.alert = false;
  }

  showErrorAlert(errorMsg) {
    this.alert = true;
    this.responseMsg = errorMsg;
    this.goToTop();
  }

  goToTop() {
    const elem = (document.getElementById("moveTop")) as HTMLSpanElement;;
    console.log(elem);
    elem.scrollIntoView({ behavior: "smooth" });
  }

  checkPasswordStrength(event) {
    console.log("checkPasswordStrength called");
    const indicator = (document.querySelector(".password_indicator") as HTMLDivElement);
    const input = (document.querySelector(".password_input") as HTMLInputElement);
    const passwordHintBox = (document.querySelector(".password_hints_wrapper") as HTMLInputElement);
    const weak = document.querySelector(".weak");
    const medium = document.querySelector(".medium");
    const strong = document.querySelector(".strong");
    const text = (document.querySelector(".password_text") as HTMLDivElement);
    const showBtn = (document.querySelector(".showPasswordBtn") as HTMLButtonElement);
    let regExpWeak = /[a-z]/;
    let regExpMedium = /\d+/;
    let regExpStrong = /[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/;
    if (input.value != "") {
      let no;
      indicator.style.display = "block";
      indicator.style.display = "flex";
      passwordHintBox.style.display = "block";

      console.log("input.value.match(regExpWeak)");
      console.log(input.value.match(regExpWeak));

      console.log("input.value.match(regExpMedium)");
      console.log(input.value.match(regExpMedium));

      console.log("input.value.match(regExpStrong)");
      console.log(input.value.match(regExpStrong));

      // if (input.value.length <= 3 && (input.value.match(regExpWeak) || input.value.match(regExpMedium) || input.value.match(regExpStrong))) no = 1;
      // if (input.value.length >= 6 && ((input.value.match(regExpWeak) && input.value.match(regExpMedium)) || (input.value.match(regExpMedium) && input.value.match(regExpStrong)) || (input.value.match(regExpWeak) && input.value.match(regExpStrong)))) no = 2;
      // if (input.value.length >= 6 && input.value.match(regExpWeak) && input.value.match(regExpMedium) && input.value.match(regExpStrong)) no = 3;

      if (input.value.match(regExpWeak) || input.value.match(regExpMedium) || input.value.match(regExpStrong)) no = 1;
      if ((input.value.match(regExpWeak) && input.value.match(regExpMedium))
        || (input.value.match(regExpWeak) && input.value.match(regExpStrong))
        || (input.value.match(regExpMedium) && input.value.match(regExpStrong))) no = 2;
      if (input.value.match(regExpWeak) && input.value.match(regExpMedium) && input.value.match(regExpStrong)) no = 3;
      if (input.value.length < 6) no = 4;

      console.log("no");
      console.log(no);

      if (no == 1) {
        weak.classList.add("active");
        text.style.display = "block";
        text.textContent = "Your password is too week";
        // text.style.color = "#ff4757";
        text.classList.add("weak");
      }
      if (no == 2) {
        medium.classList.add("active");
        text.textContent = "Your password is medium";
        // text.style.color = "orange";
        text.classList.add("medium");
      } else {
        medium.classList.remove("active");
        text.classList.remove("medium");
      }
      if (no == 3) {
        weak.classList.add("active");
        medium.classList.add("active");
        strong.classList.add("active");
        text.textContent = "Your password is strong";
        // text.style.color = "#23ad5c";
        text.classList.add("strong");
      } else {
        strong.classList.remove("active");
        text.classList.remove("strong");
      }

      if (no == 4) {
        weak.classList.add("active");
        // medium.classList.add("active");
        // strong.classList.add("active");
        text.textContent = "Password length must be atleast 6";
        // text.style.color = "#23ad5c";
        text.classList.add("week");
      }
      showBtn.style.display = "block";
      showBtn.onclick = function () {
        if (input.type == "password") {
          input.type = "text";
          showBtn.textContent = "HIDE";
          showBtn.style.color = "#23ad5c";
        } else {
          input.type = "password";
          showBtn.textContent = "SHOW";
          showBtn.style.color = "#000";
        }
      }
    } else {
      indicator.style.display = "none";
      text.style.display = "none";
      showBtn.style.display = "none";
      passwordHintBox.style.display = "none";
    }
  }

  changedOccupation(e) {
    console.log("changedOccupation called");

    // Firstly hiding the input fields which has a class of student_occupation & organisation_employee_occupation
    $('.student_occupation').addClass('display_none');
    $('.organisation_employee_occupation').addClass('display_none');

    // Extracting the selected field data attribute value
    let occupation = $(e.target).find(':selected').data('occupation')
    console.log("occupation");
    console.log(occupation);

    // Checking which occupation has been selected
    if (occupation == 'Student') {
      $('.student_occupation').removeClass('display_none')
    }
    else if (occupation == 'Organisation Employee') {
      $('.organisation_employee_occupation').removeClass('display_none');
    }
  }
}
