import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlaceModalComponent } from './order-place-modal.component';

describe('OrderPlaceModalComponent', () => {
  let component: OrderPlaceModalComponent;
  let fixture: ComponentFixture<OrderPlaceModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPlaceModalComponent]
    });
    fixture = TestBed.createComponent(OrderPlaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
