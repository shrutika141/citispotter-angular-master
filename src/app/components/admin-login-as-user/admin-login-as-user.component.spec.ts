import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginAsUserComponent } from './admin-login-as-user.component';

describe('AdminLoginAsUserComponent', () => {
  let component: AdminLoginAsUserComponent;
  let fixture: ComponentFixture<AdminLoginAsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminLoginAsUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLoginAsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
