import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySettingDialogComponent } from './company-setting-dialog.component';

describe('CompanySettingDialogComponent', () => {
  let component: CompanySettingDialogComponent;
  let fixture: ComponentFixture<CompanySettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanySettingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
