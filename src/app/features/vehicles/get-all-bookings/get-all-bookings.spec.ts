import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllBookings } from './get-all-bookings';

describe('GetAllBookings', () => {
  let component: GetAllBookings;
  let fixture: ComponentFixture<GetAllBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllBookings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
