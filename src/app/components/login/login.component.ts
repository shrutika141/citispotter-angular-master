import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { PanelService } from 'src/app/services/panel/panel.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() parentComponent: EventEmitter<any> = new EventEmitter();

  alert: boolean = false;
  errorMsg: string;
  showResendButton: boolean = false;

  constructor(
    private authService: AuthService,
    private routes: Router,
    private userService: UserService,
    private utilityService: UtilityService,
    private panelService: PanelService,
    private loaderService: LoaderService,
    // private socialAuthService: SocialAuthService
  ) {
  }

  ngOnInit(): void {
  }

  closeErrorAlertBox() {
    this.alert = false;
  }

  onSubmit(data) {
    console.log('login data');
    console.log(data);

    $('.login_loader').toggleClass('display_none');
    $('#loginBtn').toggleClass('pointer_events_none');
    this.authService
      .login(data)
      .subscribe(
        (data) => {
        $('.login_loader').toggleClass('display_none');
        $('#loginBtn').toggleClass('pointer_events_none');
        if (data.msg === 'success') {
          console.log('Login ka IP');
          console.log("this.utilityService.saveUserIpAddress");
          console.log(this.utilityService.saveUserIpAddress);

          data.data.ip = this.utilityService.saveUserIpAddress && this.utilityService.saveUserIpAddress.ip ? this.utilityService.saveUserIpAddress.ip : null;
          let login_time = moment().format(this.utilityService.dbDateTimeFormat);
          data.data.login_time = login_time;
         
          console.log('login ka mera data');
          console.log(data);

          this.userService.saveUserDataLocal(data.data);
          this.routes.navigate(['homepage']);
          location.reload(true);
        } else {
          console.log(data);
          this.alert = true;
          this.errorMsg = data.msg;
        }
      }, err => {
        console.log('login api error.');
        console.log(err);
        $('.login_loader').toggleClass('display_none');
        $('#loginBtn').toggleClass('pointer_events_none');
        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      });
  }

  // socialRegiser(data) {
  //   console.log('login data');
  //   console.log(data);

  //   $('.login_loader').toggleClass('display_none');
  //   $('#loginBtn').toggleClass('pointer_events_none');
  //   this.authService
  //     .register(data)
  //     .subscribe(data => {
  //       $('.login_loader').toggleClass('display_none');
  //       $('#loginBtn').toggleClass('pointer_events_none');
  //       if (data.msg === 'success') {
  //         let login_time = moment().format(this.utility.dbDateTimeFormat);
  //         data.data.login_time = login_time;
  //         console.log('data');
  //         console.log(data);
  //         this.userService.saveUserDataLocal(data.data);
  //         this.routes.navigate(['homepage'])
  //       } else {
  //         console.log(data);
  //         this.alert = true;
  //         this.errorMsg = data.msg;
  //       }
  //     },err=>{
  //       console.log('login api error.');
  //       console.log(err);
  //       $('.login_loader').toggleClass('display_none');
  //       $('#loginBtn').toggleClass('pointer_events_none');
  //       Swal.fire({
  //           title: `<p class='swalText'>Process failed...</p>`,
  //           html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
  //           icon: 'error',
  //           buttonsStyling: false,
  //           customClass: { confirmButton: 'btn swal_button_style' },
  //       });
  //     });
  // }

  // signInWithGoogle() {
  //   this.socialAuthService
  //     .signIn(GoogleLoginProvider.PROVIDER_ID)
  //     .then(data => {
  //       console.log("google sign-in data");
  //       console.log(data);
  //       let userObj = {
  //         name: data.name,
  //         email: data.email,
  //         google_id: data.id,
  //         social_login_type: 'google'
  //       }
  //       this.socialRegiser(userObj);
  //     }).catch(error => {
  //       console.log("google sign-in error");
  //       console.log(error);
  //     });
  // }

  // signInWithFB() {
  //   this.socialAuthService
  //     .signIn(FacebookLoginProvider.PROVIDER_ID)
  //     .then(data => {
  //       console.log("google sign-in data");
  //       console.log(data);
  //       let userObj = {
  //         name: data.name,
  //         email: data.email,
  //         facebook_id: data.id,
  //         social_login_type: 'facebook'
  //       }
  //       this.socialRegiser(userObj);
  //     }).catch(error => {
  //       console.log("google sign-in error");
  //       console.log(error);
  //     });
  // }

  sendForgetPasswordLink(data) {
    console.log("sendResetPasswordLink called.");
    if (data.email) {
      // this.loaderService.showLoadingWithOverlay("custom_overlay1", "custom_loading_outer1");
      $('.forget_password_loader').toggleClass('display_none');
      this.disableButton();
      this.panelService
        .sendForgetPasswordVerificationlLink(data)
        .subscribe(data => {
          $('.forget_password_loader').toggleClass('display_none');
          this.disableButton();
          // this.loaderService.hideLoadingWithOverlay("custom_overlay1", "custom_loading_outer1");
          console.log("sendForgetPasswordVerificationlLink api");
          console.log(data);
          $('#forgetPasswordModal').modal('hide');
          $('#resetPasswordEmail').val('');
          if (data == "success") {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>Reset password link has been sent to your email.</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
            this.showResendButton = true;
          } else if (data == "not found") {
            Swal.fire({
              title: `<p class='swalText'>User Not Found</p>`,
              html: `<p class='swalText'>Please enter correct email to recover your password!</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          }
        }, error => {
          console.log('login api error');
          console.log(error);
          $('.forget_password_loader').toggleClass('display_none');
          this.disableButton();
          Swal.fire({
            title: `<p class='swalText'>Process failed..</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        });
    } else {
      $('#forgetPasswordModal').modal('hide');
      Swal.fire({
        title: `<p class='swalText'>Invalid</p>`,
        html: `<p class='swalText'>Email field couldn't be empty.</p>`,
        icon: 'error',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn swal_button_style' },
      });
    }
  }

  resendResetPasswordEmail() {
    if ($('#resetPasswordEmail').val()) {
      console.log("resendResetPasswordEmail called.");
      let email = $('#resetPasswordEmail').val();
      $('.resend_password_loader').toggleClass('display_none');
      this.disableButton();
      this.panelService
        .resendResetPasswordEmailToUser(email)
        .subscribe(data => {
          $('.resend_password_loader').toggleClass('display_none');
          this.disableButton();
          console.log("resendActivationEmail called.");
          console.log('data');
          console.log(data);
          $('#forgetPasswordModal').modal('hide');
          $('#resetPasswordEmail').val('');
          if (data == "success") {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>The reset password email has been sent successfully.</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else if (data == "not found") {
            Swal.fire({
              title: `<p class='swalText'>Not Found</p>`,
              html: `<p class='swalText'>Entered user email not found in our record</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          }
        }, 
        (error) => {
          console.log('login api error');
          console.log(error);
          $('.resend_password_loader').toggleClass('display_none');
          this.disableButton();
          Swal.fire({
            title: `<p class='swalText'>Process failed..</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        });
    } else {
      $('#forgetPasswordModal').modal('hide');
      Swal.fire({
        title: `<p class='swalText'>Invalid</p>`,
        html: `<p class='swalText'>Email field couldn't be empty.</p>`,
        icon: 'error',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn swal_button_style' },
      });
    }
  }

  disableButton() {
    $('#sendPasswordLinkBtn').toggleClass('pointer_events_none');
    $('#resendButton').toggleClass('pointer_events_none');
  }
}
