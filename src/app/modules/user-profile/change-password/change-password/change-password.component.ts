import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  alert: boolean = false;
  responseMsg: string;

  constructor(
    private panelService: PanelService,
  ) { }

  ngOnInit(): void {
  }

  changePassword(data) {
    console.log("changePassword called");
    console.log(data);

    // The below line will hide the error alert box
    this.alert = false;

    console.log(data.password);
    console.log(data.confirm_password);

    // The below code is checking whether the password & confirm password are empty or not
    if (!data.password || !data.confirm_password) {
      return this.showErrorAlert('Password and Confrim both are mandatory fields.');
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
      return this.showErrorAlert('Poor password.Improve password to register');
    }

    this.panelService
      .changePassword(data)
      .subscribe(
        (data) => {
          console.log("changePassword called");
          console.log(data);

          if (data == "success") {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>Password changed successfully.</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else {
            this.showErrorAlert(data.errorMsg);
          }
        },
        (error) => {
          console.log('forget password api error');
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

  showErrorAlert(errorMsg) {
    this.alert = true;
    this.responseMsg = errorMsg;
    if ($("#topScrollAnchor").hasClass('myalert')) {
      $("#topScrollAnchor").removeClass("myalert");
    }
  }
}
