import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRequests } from './exchange-requests';

describe('ExchangeRequests', () => {
  let component: ExchangeRequests;
  let fixture: ComponentFixture<ExchangeRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(ExchangeRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
