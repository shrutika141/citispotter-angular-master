import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PanelService } from 'src/app/services/panel/panel.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  images: any = [];
  myQueryForm = new FormGroup({
    topic: new FormControl('', [Validators.required, Validators.minLength(3)]),
    query: new FormControl('', [Validators.required]),
    file: new FormControl(),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor(
    private panelService: PanelService,
    private loaderService: LoaderService,) { }

  ngOnInit(): void {
    console.log("HelpComponent ngOnInit called");
  }

  sendQueryToAdmin() {
    console.log("text editor sendQueryToAdmin called");
    console.log(this.myQueryForm);
    let data = this.myQueryForm.value;
    // console.log(data);
    // return;
    if (data && data.query) {
      console.log("Aandar aa gaya");
      $('.help_loader').toggleClass('display_none');
      $('#helpBtn').toggleClass('pointer_events_none');
      this.panelService
        .sendQuery(data)
        .subscribe(result => {
          console.log("sendQuery api");
          console.log(result);

          $('.help_loader').toggleClass('display_none');
          $('#helpBtn').toggleClass('pointer_events_none');
          // $('#sendQueryModal').modal('hide');
          // $('#sendQuery').val('');

          this.myQueryForm.reset();
          this.images = [];

          // data.query = '';
          // $('#query').val('');
          if (result == "success") {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>You query has been received we will get in touch soon.</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else if (result.msg == "validation error") {
            Swal.fire({
              title: `<p class='swalText'>Oops..</p>`,
              html: `<p class='swalText'>${data.err}</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else if (result.msg == "error") {
            Swal.fire({
              title: `<p class='swalText'>Process failed..</p>`,
              html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          }
        }, err => {
          console.log("help api error");
          console.log(err);
          $('.help_loader').toggleClass('display_none');
          $('#helpBtn').toggleClass('pointer_events_none');
          // $('#sendQueryModal').modal('hide');
          // $('#sendQuery').val('');
          this.myQueryForm.reset();
          this.images = [];
          Swal.fire({
            title: `<p class='swalText'>Process failed..</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        });
    } else {
      Swal.fire({
        title: `<p class='swalText'>Invalid</p>`,
        html: `<p class='swalText'>Empty query couldn't be submit.</p>`,
        icon: 'error',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn swal_button_style' },
      });
    }
  }

  onQueryAttachmentFileChange(event: any) {
    // console.log(event.target.files[0]);
    // return;
    
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.images.push(event.target.result);

          this.myQueryForm.patchValue({
            fileSource: this.images
          });
        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

}
