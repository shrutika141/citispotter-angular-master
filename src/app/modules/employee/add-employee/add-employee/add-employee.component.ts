import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PanelService } from 'src/app/services/panel/panel.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  alert: boolean = false;
  responseMsg: string;
  userOccupations: any = [];

  addEmployeeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('Select Role', [Validators.required]),
    org_contact_name: new FormControl('', [Validators.required]),
    org_contact_email: new FormControl(),
    org_contact_number: new FormControl(),
    country: new FormControl('Select Country'),
    referred_by: new FormControl(),
  });

  constructor(private panelService: PanelService) { }

  ngOnInit(): void {
  }

  addEmployee() {
    console.log("addEmployee called");
    const data = this.addEmployeeForm.value;
    console.log(data);

    $('.add_employee_loader').removeClass('display_none');
    $('#addEmployeeBtn').addClass('pointer_events_none');

    this.panelService
      .addOraganizationEmployee(data)
      .subscribe(
        (data) => {
          console.log("addOraganizationEmployee api response");
          console.log(data);

          $('.add_employee_loader').addClass('display_none');
          $('#addEmployeeBtn').removeClass('pointer_events_none');

          if (data.msg == 'success') {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>Employee added successfully</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else {
            Swal.fire({
              title: `<p class='swalText'>Process failed..</p>`,
              html: `<p class='swalText'>${data}</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          }
        },
        (error) => {
          console.log("addOraganizationEmployee api error");
          console.log(error);

          $('.add_employee_loader').addClass('display_none');
          $('#addEmployeeBtn').removeClass('pointer_events_none');

          Swal.fire({
            title: `<p class='swalText'>Process failed..</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        });

    return;
  }
}
