import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { MySubscriptionComponent } from './components/my-subscription/my-subscription.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPayPalModule } from 'ngx-paypal';
import { PlanPricingDetailsComponent } from './components/plan-pricing-details/plan-pricing-details/plan-pricing-details.component';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { LoaderComponent } from './components/loader/loader.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { HelpComponent } from './components/help/help.component';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { UtilityService } from './services/utility/utility.service';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { MessagingService } from './services/messaging/messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AdminLoginAsUserComponent } from './components/admin-login-as-user/admin-login-as-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxPrintModule } from 'ngx-print';

import { HttpCancelService } from './services/httpcancel/httpcancel.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ManageHttpInterceptor } from './http-interceptors/managehttp.interceptor';
import { StyleGuideComponent } from './components/style-guide/style-guide/style-guide.component';
import { OraganizationRegisterComponent } from './components/oraganization-register/oraganization-register/oraganization-register.component';
import { OraganizationComponent } from './components/oraganization/oraganization/oraganization.component';
import { EmployeeModule } from './modules/employee/employee.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    TextEditorComponent,
    HomepageComponent,
    MySubscriptionComponent,
    PlanPricingDetailsComponent,
    LoaderComponent,
    VerifyEmailComponent,
    ForgetPasswordComponent,
    HelpComponent,
    NotificationsComponent,
    AdminLoginAsUserComponent,
    StyleGuideComponent,
    OraganizationRegisterComponent,
    OraganizationComponent,
  ],
  imports: [
    BrowserModule,
    NgxPrintModule,
    AppRoutingModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UserProfileModule,
    NgxSpinnerModule,
    NgxPayPalModule,
    SocialLoginModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    EmployeeModule
  ],
  providers: [
    AuthGuard,
    
    // Cancelling the previous route http calls
    HttpCancelService,
    { provide: HTTP_INTERCEPTORS, useClass: ManageHttpInterceptor, multi: true },


    //   {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider('356508381078-aulu3j9s5elo1n2mms9j96tmv5cnefmo.apps.googleusercontent.com')
    //       },
    //       {
    //         id: FacebookLoginProvider.PROVIDER_ID,
    //         provider: new FacebookLoginProvider(`${UtilityService.getFacebookClientId()}`)
    //       }
    //     ]
    //   } as SocialAuthServiceConfig,
    // }
    ,
    MessagingService, AsyncPipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
