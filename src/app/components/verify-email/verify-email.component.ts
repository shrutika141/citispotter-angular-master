import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PanelService } from 'src/app/services/panel/panel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    private panelService: PanelService,
    private routes: Router,
    private _Activatedroute: ActivatedRoute,) { }

  ngOnInit(): void {
    let code = this._Activatedroute.snapshot.paramMap.get('code');
    console.log("extracted code from the url");
    console.log(code);
    this.verifyEmail(code);
  }

  verifyEmail(code) {
    console.log("verifyEmail called");
    this.panelService
      .verifyUserEmail(code)
      .subscribe(data => {
        console.log("verifyUserEmail api response");
        console.log(data);
        Swal.fire({
          title: `<p class='swalText'>Success</p>`,
          html: `<p class='swalText'>Your email has been verified successfully.</p>`,
          icon: 'success',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' }
        });
        this.routes.navigate(['homepage']);
      },
        (error) => {
          console.log("checkUserPlanExpiry api error");
          console.log(error);

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' }
          });
        });
  }
}
