import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPricingDetailsComponent } from './plan-pricing-details.component';

describe('PlanPricingDetailsComponent', () => {
  let component: PlanPricingDetailsComponent;
  let fixture: ComponentFixture<PlanPricingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanPricingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPricingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
