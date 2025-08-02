import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostedproductpageComponent } from './hostedproductpage.component';

describe('HostedproductpageComponent', () => {
  let component: HostedproductpageComponent;
  let fixture: ComponentFixture<HostedproductpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostedproductpageComponent]
    });
    fixture = TestBed.createComponent(HostedproductpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
