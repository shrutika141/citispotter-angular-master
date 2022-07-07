import { TestBed } from '@angular/core/testing';

import { OuterGuard } from './outer.guard';

describe('OuterGuard', () => {
  let guard: OuterGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OuterGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
