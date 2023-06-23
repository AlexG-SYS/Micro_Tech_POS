import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountFormComponentComponent } from './add-account-form-component.component';

describe('AddAccountFormComponentComponent', () => {
  let component: AddAccountFormComponentComponent;
  let fixture: ComponentFixture<AddAccountFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccountFormComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAccountFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
