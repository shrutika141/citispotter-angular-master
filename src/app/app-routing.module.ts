import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginAsUserComponent } from './components/admin-login-as-user/admin-login-as-user.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { HelpComponent } from './components/help/help.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { MySubscriptionComponent } from './components/my-subscription/my-subscription.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { OraganizationRegisterComponent } from './components/oraganization-register/oraganization-register/oraganization-register.component';
import { PlanPricingDetailsComponent } from './components/plan-pricing-details/plan-pricing-details/plan-pricing-details.component';
import { RegisterComponent } from './components/register/register.component';
import { StyleGuideComponent } from './components/style-guide/style-guide/style-guide.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthGuard } from './guards/auth.guard';
import { OuterGuard } from './guards/outer.guard';

const routes: Routes = [  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', canActivate: [AuthGuard], component: LoginComponent, data: { trackActivity: false, header: false, sidenav: false, footer: false } },
  { path: 'register', canActivate: [AuthGuard], component: RegisterComponent, data: { trackActivity: false, header: false, sidenav: false, footer: false } },
  { path: 'oraganization-register', canActivate: [AuthGuard], component: OraganizationRegisterComponent, data: { trackActivity: false, header: false, sidenav: false, footer: false } },
  { path: 'homepage', canActivate: [OuterGuard], component: HomepageComponent, data: { header: false, } },
  { path: 'text-editor/:id', canActivate: [OuterGuard], component: TextEditorComponent, data: { header: false, sidenav: false, footer: false } },
  { path: 'profile', canActivate: [OuterGuard], data: { header: false }, loadChildren: () => import('./modules/user-profile/user-profile.module').then(m => m.UserProfileModule), },
  { path: 'my-subscription', canActivate: [OuterGuard], component: MySubscriptionComponent, data: { header: false, } },
  { path: 'plan-pricing-details/:subscription_id/:subscription_package_id', canActivate: [OuterGuard], component: PlanPricingDetailsComponent, data: { header: false, } },
  { path: 'verify-email/:code', component: VerifyEmailComponent, data: { trackActivity: false, header: false, sidenav: false, footer: false } },
  { path: 'forget-password/:code', component: ForgetPasswordComponent, data: { trackActivity: false, header: false, sidenav: false, footer: false } },
  { path: 'help', canActivate: [OuterGuard], component: HelpComponent, data: { header: false, } },
  { path: 'notifications', canActivate: [OuterGuard], component: NotificationsComponent, data: { header: false, } },
  { path: 'admin-login-as-user/:user_id', component: AdminLoginAsUserComponent, data: { header: false, sidenav: false, footer: false } },
  { path: 'style-guide', component: StyleGuideComponent, data: { header: false, sidenav: false, footer: false } },
  { path: 'oraganization', canActivate: [OuterGuard],  data: { header: false }, loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule), },
  { path: '**', redirectTo: '/homepage', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
