import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVendorItemsComponent } from './create-vendor-items.component';

describe('CreateVendorItemsComponent', () => {
  let component: CreateVendorItemsComponent;
  let fixture: ComponentFixture<CreateVendorItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateVendorItemsComponent]
    });
    fixture = TestBed.createComponent(CreateVendorItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
