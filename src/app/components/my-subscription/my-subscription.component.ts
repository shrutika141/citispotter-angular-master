import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare var $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-subscription',
  templateUrl: './my-subscription.component.html',
  styleUrls: ['./my-subscription.component.css'],
})
export class MySubscriptionComponent implements OnInit {
  userPlanData: any = [];
  planData: any = [];
  userInvoiceData: any = [];
  isAnyInvoicePresent: boolean = false;
  isAnySubscriptionPresent: boolean = false;
  isUserHasPlan: boolean = false;
  userSubscriptionPackageId: any;

  constructor(
    private panelService: PanelService,
    public userService: UserService,
    public utilityService: UtilityService,
    private loaderService: LoaderService,
    public routes: Router
  ) { }

  ngOnInit(): void {
    this.getUserPlanList();
    this.getAllUserInvoicesList();
    this.getAllPlanList();
  }

  purchasePlan(item, index) {
    console.log('subscription_id');
    console.log(item);
    console.log('index');
    console.log(index);
    let subPackage = $(`input[name=sub_packages${index}]:checked`).val();
    console.log(subPackage);
    if (!subPackage) {
      subPackage = item.subscriptionPackageInfo
        .filter(obj => obj.is_default_slab == 'Y')
        .map(function (o) { return o.id; });

      subPackage = subPackage[0];
    }

    console.log('phir se');
    console.log(subPackage);
    this.routes.navigate([`/plan-pricing-details/${item.id}/${+subPackage}`]);
  }

  getUserPlanList() {
    console.log('getUserPlanList called');
    let type = this.userService.userData.role == 'D' ? 'L' : 'S';
    let user_id = this.userService.userData.id;
    console.log('this.user.userData.id, type');
    console.log(user_id, type);
    this.loaderService.showLoading('custom_loading_outer1');
    this.panelService
      .userPlanInfo(user_id, type)
      .subscribe(
        (data) => {
          this.loaderService.hideLoading('custom_loading_outer1');
          console.log('userPlanData data');
          console.log(data);
          // this.userPlanData = data;
          if (Array.isArray(data)) {
            console.log('inside userPlanData if');
            this.userPlanData = data;
          } else {
            console.log('inside userPlanData else');
            this.userPlanData.push(data);
          }
          console.log('this.userPlanData.subscriptionInfo');
          console.log(this.userPlanData);
          console.log(this.userPlanData[0].subscriptionInfo);
          this.isUserHasPlan = this.userPlanData[0].subscriptionInfo
            ? false
            : true;
          // this.isUserHasPlan = this.userPlanData.length > 0 ? false : true;
          console.log('this.isUserHasPlan');
          console.log(this.isUserHasPlan);
        },
        (error) => {
          console.log("userPlanInfo api error");
          console.log(error);
          this.loaderService.hideLoading('custom_loading_outer1');
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  getAllUserInvoicesList() {
    console.log('getAllUserInvoicesList called');
    this.loaderService.showLoading('custom_loading_outer2');
    this.panelService
      .getAllUserInvoicesData()
      .subscribe(
        (data) => {
          this.loaderService.hideLoading('custom_loading_outer2');
          console.log('getAllUserInvoicesData api');
          console.log(data);
          if (Array.isArray(data)) {
            console.log('inside userInvoiceData if');
            this.userInvoiceData = data;
          } else {
            console.log('inside userInvoiceData else');
            this.userInvoiceData.push(data);
          }
          console.log('this.userInvoiceData');
          console.log(this.userInvoiceData);

          this.isAnyInvoicePresent =
            this.userInvoiceData.length <= 0 ? true : false;
          console.log('this.isAnyInvoicePresent');
          console.log(this.isAnyInvoicePresent);
        },
        (error) => {
          console.log("getAllUserInvoicesData api error");
          console.log(error);
          this.loaderService.hideLoading('custom_loading_outer2');
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  getAllPlanList() {
    console.log('getAllPlanList called');
    // let type = this.userService.userData.role === 'D' ? this.utilityService.planType?.LICENSE : this.utilityService.planType?.SUBSCRIPTION;
    let type = this.userService.userData.role === 'D' ? "L" : "S";
    this.loaderService.showLoading('custom_loading_outer3');
    this.panelService
      .getAllPlanListData(type)
      .subscribe(
        (data) => {
          this.loaderService.hideLoading('custom_loading_outer3');
          console.log('getAllPlanListData data');
          console.log(data);
          if (Array.isArray(data)) {
            this.planData = data;
          } else {
            this.planData.push(data);
          }
          console.log('this.planData');
          console.log(this.planData);
          console.log('this.planData.length');
          console.log(this.planData.length);
          this.isAnySubscriptionPresent =
            this.planData.length <= 0 ? true : false;
          console.log('this.isAnySubscriptionPresent');
          console.log(this.isAnySubscriptionPresent);
        },
        (error) => {
          console.log("getAllPlanListData api error");
          console.log(error);
          this.loaderService.hideLoading('custom_loading_outer3');
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  generateInvoice(invoice_number) {
    console.log('generateInvoice called');
    console.log('invoice_number');
    console.log(invoice_number);

    this.panelService
      .generateUserInvoice(invoice_number)
      .subscribe((data) => {
        console.log('generateUserInvoice api');
        console.log(data);
        console.log(typeof data);
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(data, 'text/html');
        console.log('htmlDoc');
        console.log(htmlDoc);
        $('#invoice_body').html('');
        // $('#invoice_body').append(`<div class="text-center">
        //                             <img src="assets/assets/images/New Citispotter Logos/logo white beta new.png" style="width:200px;">
        //                           </div>`);
        $('#invoice_body').append(htmlDoc.body.innerHTML.replace(/\\n/g, '').replace(/"/g, ''));
        $('#downloadInvoiceModal').modal('show');
      });
  }

  captureScreen() {
    this.utilityService.downloadA3SizePdf('invoice_body');
    // this.utilityService.downloadFileAsPdf('invoice_body');
    // console.log('mysubcription captureScreen called');
    // var data = document.getElementById('invoice_body');
    // console.log(data);
    // html2canvas(data,{ scale: 2 }).then((canvas) => {
    //   console.log('inside html2canvas');
    //   var imgWidth = 208;
    //   var imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   const contentDataURL = canvas.toDataURL('image/png');
    //   let pdf = new jspdf('p', 'mm', 'a3'); // A4 size page of PDF
    //   var position = 0;
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    //   pdf.save('download.pdf'); // Generated PDF
    // });
  }
}
