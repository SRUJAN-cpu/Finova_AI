import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPerformance } from './client-performance';

describe('ClientPerformance', () => {
  let component: ClientPerformance;
  let fixture: ComponentFixture<ClientPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPerformance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientPerformance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
