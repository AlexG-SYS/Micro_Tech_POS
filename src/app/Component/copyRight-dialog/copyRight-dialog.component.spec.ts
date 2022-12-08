import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyRightDialogComponent } from './copyRight-dialog.component';

describe('AppSettingDialogComponent', () => {
  let component: CopyRightDialogComponent;
  let fixture: ComponentFixture<CopyRightDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyRightDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyRightDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
