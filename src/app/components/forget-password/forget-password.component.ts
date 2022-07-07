import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PanelService } from 'src/app/services/panel/panel.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  alert: boolean = false;
  responseMsg: string = "New password and confirm password fields don't match.Please try again.";

  constructor(
    private panelService: PanelService,
    private routes: Router,
    private _Activatedroute: ActivatedRoute,
    private loaderService: LoaderService) { }

  code: any;

  ngOnInit(): void {
    this.code = this._Activatedroute.snapshot.paramMap.get('code');
    console.log("extracted code from the forget password url");
    console.log(this.code);
    // this.verifyEmail(code);
  }

  forgetPassword(data) {
    console.log("forgetPassword called");
    console.log(data);
    if (data.confirmPassword != data.password) {
      const errorText = "New password and confirm password fields don't match.Please try again.";
      this.showErrorAlert(errorText);
    } else {
      console.log("this.codde");
      if (this.code) {
        console.log("inside if");
        data.code = this.code;
        console.log("data before sending");
        console.log(data);
        this.loaderService.showLoadingWithOverlay("custom_overlay1", "custom_loading_outer1");
        // return;
        this.panelService
          .resetPassword(data)
          .subscribe(data => {
            console.log("forgetPassword called");
            console.log(data);
            this.loaderService.hideLoadingWithOverlay("custom_overlay1", "custom_loading_outer1");
            if (data.msg == "error") {
              this.showErrorAlert(data.errorMsg);
            }
            else if (data == "expired") {
              Swal.fire({
                title: `<p class='swalText'>Process denied.. 😦</p>`,
                html: `<p class='swalText'>Reset link has been expired.Kindly resend it to continue</p>`,
                icon: 'warning',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' },
              });
              this.routes.navigate(['login']);
            }
            else if (data == "success") {
              Swal.fire({
                title: `<p class='swalText'>Success</p>`,
                html: `<p class='swalText'>Password changed successfully.</p>`,
                icon: 'success',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' },
              });
              this.routes.navigate(['login']);
            }
          }, 
          (error) => {
            console.log('forget password api error');
            console.log(error);
            this.loaderService.hideLoadingWithOverlay("custom_overlay1", "custom_loading_outer1");
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
  }

  showErrorAlert(errorMsg) {
    this.alert = true;
    this.responseMsg = errorMsg;
  }

}
