import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OraganizationRegisterComponent } from './oraganization-register.component';

describe('OraganizationRegisterComponent', () => {
  let component: OraganizationRegisterComponent;
  let fixture: ComponentFixture<OraganizationRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OraganizationRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OraganizationRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
