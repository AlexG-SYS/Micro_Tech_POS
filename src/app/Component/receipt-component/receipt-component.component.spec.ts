import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptComponentComponent } from './receipt-component.component';

describe('ReceiptComponentComponent', () => {
  let component: ReceiptComponentComponent;
  let fixture: ComponentFixture<ReceiptComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
