import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OraganizationComponent } from './oraganization.component';

describe('OraganizationComponent', () => {
  let component: OraganizationComponent;
  let fixture: ComponentFixture<OraganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OraganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OraganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
