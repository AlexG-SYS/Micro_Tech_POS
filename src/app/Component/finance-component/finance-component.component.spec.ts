import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceComponentComponent } from './finance-component.component';

describe('FinanceComponentComponent', () => {
  let component: FinanceComponentComponent;
  let fixture: ComponentFixture<FinanceComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceComponentComponent]
    });
    fixture = TestBed.createComponent(FinanceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
