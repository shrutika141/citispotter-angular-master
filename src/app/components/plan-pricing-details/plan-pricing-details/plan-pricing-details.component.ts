import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
declare var $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-pricing-details',
  templateUrl: './plan-pricing-details.component.html',
  styleUrls: ['./plan-pricing-details.component.css'],
})
export class PlanPricingDetailsComponent implements OnInit {
  buyingSubscriptionInfo: any = {};
  discountedPrice: number = 0;
  totalPrice: number = 0;
  discountCouponInfo: any = {};
  subscription_id: any;
  subscription_package_id: any;
  isDiscountCouponUsed: boolean = false;
  packagePriceWithoutDiscount: number;

  constructor(
    private panelService: PanelService,
    private routes: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService
  ) {
    console.log('First constructor');
    // 1st way
    // if (this.routes.getCurrentNavigation().extras.state) {
    //   this.buyingSubscriptionInfo = this.routes.getCurrentNavigation().extras.state.example;
    //   console.log('this.buyingSubscriptionInfo');
    //   console.log(this.buyingSubscriptionInfo);
    //   console.log(this.buyingSubscriptionInfo.id);
    // }
  }

  public payPalConfig?: IPayPalConfig;

  ngOnInit(): void {
    this.subscription_id =
      this.activatedRoute.snapshot.paramMap.get('subscription_id');
    this.subscription_package_id = this.activatedRoute.snapshot.paramMap.get(
      'subscription_package_id'
    );

    console.log('this.subscription_id');
    console.log(this.subscription_id);
    console.log('this.subscription_package_id');
    console.log(this.subscription_package_id);

    if (this.subscription_id && this.subscription_package_id) {
      this.buyingSubscriptionInfo.subscription_id = this.subscription_id;
      this.buyingSubscriptionInfo.subscription_package_id =
        this.subscription_package_id;
      console.log('Hello if');
      console.log('this.buyingSubscriptionInfo');
      console.log(this.buyingSubscriptionInfo);

      this.toggleClassInDom();
      this.loaderService.showLoading('custom_loading_outer1');

      this.panelService
        .getSubscriptionAmount(this.buyingSubscriptionInfo)
        .subscribe(
          (data) => {
            this.toggleClassInDom();
            this.loaderService.hideLoading('custom_loading_outer1');
            console.log('data');
            console.log(data);
            if (data.msg == 'success') {
              console.log('data.data.package_price');
              console.log(data.data.package_price);
              this.packagePriceWithoutDiscount = data.data.package_price;
              this.buyingSubscriptionInfo.subscription_package_price =
                data.data.package_price;
              this.claculatePriceWithDiscount();
              this.initConfig();
            }
          },
          (err: any) => {
            this.toggleClassInDom();
            this.loaderService.hideLoading('custom_loading_outer1');
            console.log(err);
            Swal.fire({
              title: `<p class='swalText'>Process failed...</p>`,
              html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          }
        );
    } else {
      Swal.fire({
        title: `<p class='swalText'>Oops..</p>`,
        html: `<p class='swalText'>Can't directly access this page.</p>`,
        icon: 'warning',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn swal_button_style' },
      });
      this.routes.navigate(['homepage']);
    }

    // ==========================
    // console.log('Second ngOnInit');
    // 2nd way
    // const mySubscriptionObj = this.activatedRoute.snapshot.queryParamMap.get('mySubscriptionObj');
    // if (mySubscriptionObj == null) {
    //   console.log('mySubscriptionObj is empty.');
    // } else {
    //   console.log('mySubscriptionObj');
    //   console.log(mySubscriptionObj);
    //   this.buyingSubscriptionInfo = JSON.parse(mySubscriptionObj);
    //   console.log('this.buyingSubscriptionInfo');
    //   console.log(this.buyingSubscriptionInfo);
    // }
    // this.claculatePriceWithDiscount();
    // this.initConfig();
  }

  claculatePriceWithDiscount() {
    this.totalPrice = +(
      this.buyingSubscriptionInfo.subscription_package_price -
      this.discountedPrice
    ).toFixed(2);
  }

  generateOrderIdData() {
    console.log('outside state example if');
    this.buyingSubscriptionInfo.subscription_package_price = this.totalPrice;
    let userObject = {
      user_id: this.userService.userData.id,
      subscriptionInfo: this.buyingSubscriptionInfo,
      discountCouponInfo: this.discountCouponInfo,
    };
    console.log('userObject');
    console.log(userObject);

    return this.panelService
      .generateOrderId(userObject)
      .toPromise()
      .then((data) => data);
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      // currency: 'GBP',

      // Sandbox demo
      clientId:'AcpaJqElRhkHkdaKL0wYJq0pLLmwsqsgyPc6One6bG91cuY0MEO-14aegNcbCRxbiGLMRU-1O40QvZRG',

      // Local
      // clientId: 'AdMYAYH2kXvN60nAkyDODUvkODQFR_7F7bTelkXZglOXfVBLeu9PyvbHUnpXjHXw7MnrfTVeX3IfHbha',

      // Production
      // clientId: 'AV08ACI59MSw1QojoUr5Qezv97tZ9KZ-2NKfeEB1R7Vgb7yZiCsTWagEhnbYaHJwI4xlJWrZFV59p508',

      style: {
        layout: 'horizontal',
      },
      createOrderOnServer: (data) =>
        this.generateOrderIdData()
          .then((order) => order.orderID)
          .catch((err) => {
            console.log('error aa gya !');
            console.log(err);
          }),

      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized');
        console.log('onApprove data');
        console.log(data);
        console.log('onApprove actions');
        console.log(actions);
        // this.buyPlan(data);

        actions.order.get().then((details) => {
          console.log(
            'onApprove - you can get full order details inside onApprove:'
          );
          console.log('details are');
          console.log(details);
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point'
        );
        console.log('onClientAuthorization data');
        console.log(data);
        this.buyPlan(data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError');
        console.log(err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      },
    };
  }

  buyPlan(paymentData) {
    let userPlanInfo = {
      user_id: this.userService.userData.id,
      plan_id: this.buyingSubscriptionInfo.subscription_id,
      orderId: paymentData.id,
      transactionId: paymentData.purchase_units[0].payments.captures[0].id,
      subscription_package_id:
        this.buyingSubscriptionInfo.subscription_package_id,
      subscription_package_price: this.totalPrice,
      transactionData: paymentData,
      // discountCouponInfo: this.discountCouponInfo
    };

    console.log('userPlanInfo');
    console.log(userPlanInfo);

    this.toggleClassInDom();
    this.loaderService.showLoading('custom_loading_outer1');

    this.panelService.purchasePlan(userPlanInfo).subscribe(
      (ans) => {
        this.toggleClassInDom();
        this.loaderService.hideLoading('custom_loading_outer1');
        console.log('ans');
        console.log(ans);
        if (ans.msg == 'success') {
          console.log('yiippeee');
          Swal.fire({
            title: `<p class='swalText'>Success</p>`,
            html: `<p class='swalText'>Payment successfully done.</p>`,
            icon: 'success',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
          this.routes.navigate(['my-subscription']);
        }
      },
      (error: any) => {
        this.toggleClassInDom();
        this.loaderService.hideLoading('custom_loading_outer1');
        console.log(error);
        Swal.fire({
          title: `<p class='swalText'>Process failed..</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      }
    );
  }

  applyDiscountcoupon() {
    if ($('#coupon_code').val().length == 0) {
      Swal.fire({
        title: `<p class='swalText'>Oops.</p>`,
        html: `<p class='swalText'>Empty coupon code not allowed.</p>`,
        icon: 'error',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn swal_button_style' },
      });
    } else {
      if (this.isDiscountCouponUsed) {
        Swal.fire({
          title: `<p class='swalText'>Process denied..</p>`,
          html: `<p class='swalText'>One coupon code is already been applied.No more coupons can be applied!</p>`,
          icon: 'warning',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
        return;
      }

      let discountCouponInfo = {
        subscription_id: this.buyingSubscriptionInfo.subscription_id,
        coupon_code: $('#coupon_code').val(),
      };

      console.log('discountCouponInfo');
      console.log(discountCouponInfo);

      console.log('applyDiscountOnSubscription called');
      // this.loadingService.showLoading("custom_loading_outer1");
      this.panelService
        .applyDiscountOnSubscription(discountCouponInfo)
        .subscribe((data) => {
          this.discountedPrice = 0;
          console.log('applyDiscountOnSubscription api');
          console.log(data);
          if (data != 'success') {
            this.claculatePriceWithDiscount();
          }

          if (data == 'Invalid') {
            // this.claculatePriceWithDiscount();
            Swal.fire({
              title: `<p class='swalText'>Oops..</p>`,
              html: `<p class='swalText'>Incorrect coupon code</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else if (data == 'Not applicable') {
            // this.claculatePriceWithDiscount();
            Swal.fire({
              title: `<p class='swalText'>Not Applicable..</p>`,
              html: `<p class='swalText'>Entered coupon code is not applicable to this plan</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else if (data == 'overflow') {
            // this.claculatePriceWithDiscount();
            Swal.fire({
              title: `<p class='swalText'>Not Applicable..</p>`,
              html: `<p class='swalText'>Entered coupon code is not applicable to this plan</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
            Swal.fire({
              title: `<p class='swalText'>Limit Exceeded..</p>`,
              html: `<p class='swalText'>Coupon limit is exceeded.Can't be used</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else if (data.msg == 'success') {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>Discount code accepted!</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
            let packagePrice =
              this.buyingSubscriptionInfo.subscription_package_price;
            let coupon_discount = data.data[0].coupon_discount;
            this.discountedPrice = +(
              (packagePrice * coupon_discount) /
              100
            ).toFixed(2);
            this.totalPrice = +(packagePrice - this.discountedPrice).toFixed(2);
            this.discountCouponInfo = data.data[0];
            console.log('this.discountCouponInfo');
            console.log(this.discountCouponInfo);
            this.isDiscountCouponUsed = true;
            console.log('this.isDiscountCouponUsed');
            console.log(this.isDiscountCouponUsed);
          }
        });
    }
  }

  toggleClassInDom() {
    $('#overlay').toggleClass('display_none');
    $('#paypal_main_wrapper').toggleClass('pointer_events_none');
  }
}
