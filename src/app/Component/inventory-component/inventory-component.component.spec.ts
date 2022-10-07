import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryComponentComponent } from './inventory-component.component';

describe('InventoryComponentComponent', () => {
  let component: InventoryComponentComponent;
  let fixture: ComponentFixture<InventoryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
