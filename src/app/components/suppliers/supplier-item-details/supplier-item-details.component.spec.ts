import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierItemDetailsComponent } from './supplier-item-details.component';

describe('SupplierItemDetailsComponent', () => {
  let component: SupplierItemDetailsComponent;
  let fixture: ComponentFixture<SupplierItemDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierItemDetailsComponent]
    });
    fixture = TestBed.createComponent(SupplierItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
