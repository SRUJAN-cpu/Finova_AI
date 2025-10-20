import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetOptimizer } from './budget-optimizer';

describe('BudgetOptimizer', () => {
  let component: BudgetOptimizer;
  let fixture: ComponentFixture<BudgetOptimizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetOptimizer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetOptimizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
