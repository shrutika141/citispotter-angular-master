import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OraganizationComponent } from 'src/app/components/oraganization/oraganization/oraganization.component';
import { OuterGuard } from 'src/app/guards/outer.guard';
import { AddEmployeeComponent } from './add-employee/add-employee/add-employee.component';
import { EmployeeListComponent } from './employee-list/employee-list/employee-list.component';

const routes: Routes = [
    {
        path: 'employee',
        component: OraganizationComponent,
        children: [
            {
                path: 'add-employee',
                canActivate: [OuterGuard],
                component: AddEmployeeComponent,
                data: { header: false },
            },
            {
                path: 'employee-list',
                canActivate: [OuterGuard],
                component: EmployeeListComponent,
                data: { header: false },
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }
