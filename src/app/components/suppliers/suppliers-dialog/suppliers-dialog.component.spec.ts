import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersDialogComponent } from './suppliers-dialog.component';

describe('SuppliersDialogComponent', () => {
  let component: SuppliersDialogComponent;
  let fixture: ComponentFixture<SuppliersDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuppliersDialogComponent]
    });
    fixture = TestBed.createComponent(SuppliersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
