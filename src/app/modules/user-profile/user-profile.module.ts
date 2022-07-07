import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile/edit-profile/edit-profile.component';
import { ProfileDetailsComponent } from './profile-details/profile-details/profile-details.component';
import { FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-profile-routing.module';
import { ChangePasswordComponent } from './change-password/change-password/change-password.component';


@NgModule({
  declarations: [ProfileDetailsComponent,EditProfileComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
  ],
  exports: [ProfileDetailsComponent,EditProfileComponent,ChangePasswordComponent]
})
export class UserProfileModule { }
