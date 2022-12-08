import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUserSettingDialogComponent } from './company-user-setting-dialog.component';

describe('CompanyUserSettingDialogComponent', () => {
  let component: CompanyUserSettingDialogComponent;
  let fixture: ComponentFixture<CompanyUserSettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyUserSettingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyUserSettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
