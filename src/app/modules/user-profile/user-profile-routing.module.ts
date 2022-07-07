import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { OuterGuard } from 'src/app/guards/outer.guard';
import { ChangePasswordComponent } from './change-password/change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile/edit-profile.component';
import { ProfileDetailsComponent } from './profile-details/profile-details/profile-details.component';

const routes: Routes = [
    {
        path: 'tabs',
        component: ProfileComponent,
        children: [
            {
                path: 'profile-details',
                canActivate: [OuterGuard],
                component: ProfileDetailsComponent,
                data: { header: false },
            },
            {
                path: 'edit-profile',
                canActivate: [OuterGuard],
                component: EditProfileComponent,
                data: { header: false },
            },
            {
                path: 'change-password',
                canActivate: [OuterGuard],
                component: ChangePasswordComponent,
                data: { header: false },
            },
            {
                path: '',
                redirectTo: 'tabs/profile-details',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'tabs/profile-details',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
