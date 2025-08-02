import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsOrderTrackingComponent } from './products-order-tracking.component';

describe('ProductsOrderTrackingComponent', () => {
  let component: ProductsOrderTrackingComponent;
  let fixture: ComponentFixture<ProductsOrderTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsOrderTrackingComponent]
    });
    fixture = TestBed.createComponent(ProductsOrderTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
