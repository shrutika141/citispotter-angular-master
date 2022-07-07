import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { MessagingService } from 'src/app/services/messaging/messaging.service';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './new-homepage.component.html',
  styleUrls: ['./new-homepage.component.css']
  // templateUrl: './homepage.component.html',
  // styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  allDocumentData: any = [];
  isUserEmailVerify: boolean = false;
  message;
  sortDocumentBy: string = "Last edited";
  documentSorting: any = ["Last edited", "Last created", "Docs name"]

  constructor(
    private routes: Router,
    private panelService: PanelService,
    private userService: UserService,
    private utilityService: UtilityService,
    private loaderService: LoaderService,
    private messagingService: MessagingService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('HomepageComponent ngOnInit called');

    // Asking user to give permission for sending notification
    // this.pushNotify();

    this.getAllSavedDocumentData();
    this.checkIsUserEmailVerified();
  }

  ngAfterViewChecked() {
    $("[data-toggle=tooltip]").tooltip();
  }

  pushNotify() {
    console.log('this.userService.userFcmToken');
    console.log(this.userService.userFcmToken);
    if (!this.userService.userFcmToken) {
      console.log('this.userService.userFcmToken inside if');
      this.messagingService.requestPermission();
      this.messagingService.receiveMessage();
      this.message = this.messagingService.currentMessage;
      console.log("message");
      console.log(this.message);
    }
  }

  checkIsUserEmailVerified() {
    console.log('checkIsUserEmailVerified called.');
    this.panelService
      .isUserVerifiedEmail()
      .subscribe(data => {
        console.log('isUserVerifiedEmail api response.');
        console.log(data);
        this.isUserEmailVerify = data;
        console.log("this.isUserEmailVerify");
        console.log(this.isUserEmailVerify);

        if (this.isUserEmailVerify) {
          console.log("inside this.isUserEmailVerify if");
          $("#homepage_inner_child2").css("pointer-events", "none");
          $("#my_subscription").css("pointer-events", "none");
        } else {
          console.log("inside this.isUserEmailVerify else");
          $("#homepage_inner_child2").css("pointer-events", "auto");
          $("#my_subscription").css("pointer-events", "auto");
        }
      }, error => {
        console.log("isUserVerifiedEmail api error");
        console.log(error);
      });
  }

  getAllSavedDocumentData() {
    console.log("getAllSavedDocumentData called.");
    this.loaderService.showLoading('custom_loading_outer1');
    this.panelService.getAllSavedDocument().subscribe(data => {
      this.loaderService.hideLoading('custom_loading_outer1');
      console.log('getSavedDocument api response');
      console.log(data);
      if (data.msg == "success") {
        this.allDocumentData = data.data;
      }
    }, error => {
      console.log("getAllSavedDocument api error");
      console.log(error);
      this.loaderService.hideLoading('custom_loading_outer1');
    });
  }

  resendActivationEmail() {
    console.log("resendActivationEmail called.");

    $('.resend_activation_email_loader').toggleClass('display_none');
    $('#resendActivationEmailBtn').toggleClass('pointer_events_none');
    this.panelService.
      resendActivationEmailToUser()
      .subscribe(data => {
        console.log("resendActivationEmail called.");
        $('.resend_activation_email_loader').toggleClass('display_none');
        $('#resendActivationEmailBtn').toggleClass('pointer_events_none');
        console.log('data');
        console.log(data);
        if (data == "success") {
          Swal.fire({
            title: `<p class='swalText'>Success 😊</p>`,
            html: `<p class='swalText'>The activation email has been sent successfully!</p>`,
            icon: 'success',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      }, err => {
        console.log("help api error");
        console.log(err);
        $('.resend_activation_email_loader').toggleClass('display_none');
        $('#resendActivationEmailBtn').toggleClass('pointer_events_none');
        Swal.fire({
          title: `<p class='swalText'>Process failed..</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      });
  }

  getDocumentText(document_id) {
    console.log("getDocumentText called");
    this.routes.navigate([`/text-editor/${document_id}`]);
  }

  deleteDocument(document_id, event) {
    console.log('deleteDocument called.!');
    console.log(document_id);
    event.stopPropagation();
    Swal.fire({
      title: `<p class='swalText'>Are you sure</p>`,
      showDenyButton: true,
      denyButtonText: 'Cancel',
      buttonsStyling: false,
      icon: 'question',
      customClass: { confirmButton: 'btn swal_button_style margin_right_10', denyButton: 'btn btn-primary' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.panelService.deleteDocument(document_id).subscribe(data => {
          if (data.msg == "success") {
            this.getAllSavedDocumentData();
          } else {
            Swal.fire({
              title: `<p class='swalText'>Deletion failed...</p>`,
              html: `<p class='swalText'>Please try later.</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          }
        });
      }
    });
  }

  getTextEditorDataInHTMLFormat() {
    return { user_id: this.userService.userData.id, editorText: null };
  }

  downloadTxtFile(documentText) {
    console.log('downloadFile called');
    documentText = this.removeHtmlTagsAndGetText(documentText);

    var blob = new Blob([documentText], {
      type: 'text/plain;charset=utf-8',
    });
    var url = URL.createObjectURL(blob),
      div = document.createElement('div'),
      anch = document.createElement('a');
    document.body.appendChild(div);
    div.appendChild(anch);
    anch.innerHTML = '&nbsp;';
    div.style.width = '0';
    div.style.height = '0';
    anch.href = url;
    anch.download = `file.txt`;

    var ev = new MouseEvent('click', {});
    anch.dispatchEvent(ev);
    document.body.removeChild(div);
  }

  downloadDocxFile(documentText) {
    console.log('downloadDocxFile called');
    documentText = this.removeHtmlTagsAndGetText(documentText);
    console.log("documentText");
    console.log(documentText);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph({ text: documentText, children: [new TextRun({ font: "Arial", size: 24 })] }),],
        },


      ],
    });
    Packer.toBlob(doc).then((blob) => {
      // saveAs from FileSaver will download the file
      saveAs(blob, 'file.docx');
    });
  }

  downloadPdfTextFile(documentText) {
    documentText = this.removeHtmlTagsAndGetText(documentText);
    this.utilityService.downloadTextAsPdf(documentText);
  }

  async selectDocumentDownloadFormat(data, event) {
    console.log('selectDocumentDownloadFormat called.!');
    event.stopPropagation();

    await Swal
      .fire({
        title: 'Select the format',
        input: 'select',
        inputOptions: {
          txt: 'TXT',
          docx: 'DOCX',
          pdf: 'PDF',
        },
        confirmButtonText: 'Download',
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            console.log("value");
            console.log(value);
            if (value && value == "txt") {
              this.downloadTxtFile(data.text);
            }
            else if (value && value == "docx") {
              this.downloadDocxFile(data.text);
            }
            else if (value && value == "pdf") {
              this.downloadPdfTextFile(data.text);
            }
            Swal.close();
          });
        }
      });
  }

  removeHtmlTagsAndGetText(documentText) {
    $('#text_append_div').html(documentText);
    let body = document.getElementById('text_append_div').innerText;
    $('#text_append_div').html('');
    return body;
  }

  menuToggle() {
    const toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active');
  }

  applyFilter(filterValue) {
    console.log("filterValue");
    console.log(filterValue);

    console.log("getAllSavedDocumentData called.");
    this.loaderService.showLoading('custom_loading_outer1');

    this.panelService
      .getAllSavedDocument(filterValue)
      .subscribe(data => {
        this.loaderService.hideLoading('custom_loading_outer1');
        console.log('getSavedDocument api response');
        console.log(data);

        if (data.msg == "success") {
          this.allDocumentData = data.data;
        }
      }, error => {
        console.log("getAllSavedDocument api error");
        console.log(error);
        this.loaderService.hideLoading('custom_loading_outer1');
      });
  }

  extractDocumentTextFromHTML(html) {
    let template = document.createElement('div');
    // console.log("html");
    // console.log(html);
    template.innerHTML = html;
    // console.log("template.innerText");
    // console.log(template.innerText);
    // console.log("typeof template");
    // console.log(typeof template);

    return template.innerText;
  }

  changeDocSorting(val, i) {
    console.log("changeDocSorting called");
    console.log(val);

    // Assigning selected value to sortDocumentBy
    this.sortDocumentBy = val;

    // Hidding correct tick
    $(`._Last_Created_Tick_`).addClass('display_none');
    $(`.list${i} ._Last_Created_Tick_`).removeClass('display_none');

    console.log("this.allDocumentData");
    console.log(this.allDocumentData);

    if (val == "Last created") {

      // Sort document list by last created
      this.allDocumentData
        .sort((a, b) => this.utilityService.getDataByMilliseconds(b.created_at) - this.utilityService.getDataByMilliseconds(a.created_at));

    } else if (val == "Last edited") {

      // Sort document list by last edited
      this.allDocumentData
        .sort((a, b) => this.utilityService.getDataByMilliseconds(b.updated_at) - this.utilityService.getDataByMilliseconds(a.updated_at));

    } else if (val == "Docs name") {

      // Sort document list by document name
      this.allDocumentData
        .sort((a, b) => (b.title > a.title ? -1 : 1));
    }
  }
}
