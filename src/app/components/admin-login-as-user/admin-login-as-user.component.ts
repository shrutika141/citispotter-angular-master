import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-admin-login-as-user',
  templateUrl: './admin-login-as-user.component.html',
  styleUrls: ['./admin-login-as-user.component.css']
})
export class AdminLoginAsUserComponent implements OnInit {

  user_id: number;

  constructor(
    private _Activatedroute: ActivatedRoute,
    private panelService: PanelService,
    private userService: UserService,
    private routes: Router) { }

  ngOnInit(): void {
    let userId = this._Activatedroute.snapshot.paramMap.get('user_id');
    this.adminLoginAsUser(userId);
  }

  adminLoginAsUser(userId) {
    console.log('Happy to see you.');
    console.log(userId);

    $('#adminloginAsUserLoader').removeClass('display_none');
    this.panelService
      .getUserDataById(userId)
      .subscribe(data => {
        console.log('Admin verified to login as user.');
        console.log(data);
        $('#adminloginAsUserLoader').addClass('display_none');
        this.userService.saveUserDataLocal(data);
        this.routes.navigate(['homepage']);
      },error =>{
        console.log('admin verification to login as user api error');
        console.log(error);
        $('#adminloginAsUserLoader').addClass('display_none');
        Swal.fire({
          title: `<p class='swalText'>Verification failed.. 😦</p>`,
          html: `<p class='swalText'>Something went wrong at admin panel while verifying.</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      });
  }

}
