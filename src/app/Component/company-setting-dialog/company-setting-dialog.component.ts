import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalComponent } from 'src/app/global-component';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-company-setting-dialog',
  templateUrl: './company-setting-dialog.component.html',
  styleUrls: ['./company-setting-dialog.component.css'],
})
export class CompanySettingDialogComponent implements OnInit {
  // Form group to hold company information
  companyInfoForm!: FormGroup;
  error: string = '';

  // -------------------------------------------------------------------------------------------------------------
  constructor(
    private dialogRef: MatDialogRef<CompanySettingDialogComponent>,
    private formB: FormBuilder,
    private userService: UserService
  ) {
    // Initialize the companyInfoForm with default values and validation rules
    this.companyInfoForm = this.formB.group({
      name: [GlobalComponent.companyName, Validators.required],
      street: [GlobalComponent.companyStreet, Validators.required],
      city_town_village: [
        GlobalComponent.companyCityTownVillage,
        Validators.required,
      ],
      country: [GlobalComponent.companyCountry, Validators.required],
      phoneNumber: [
        GlobalComponent.companyPhoneNumber,
        [Validators.required, Validators.pattern('[0-9 ]{7}')],
      ],
      TIN: [
        GlobalComponent.companyTIN,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  ngOnInit(): void {}
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Validates user input, updates company information, and closes the dialog
  save() {
    if (this.companyInfoForm.valid) {
      const companyInfo = this.companyInfoForm.value;

      // Update company information through the UserService
      this.userService.updateCompanyInfo(companyInfo).subscribe(() => {
        this.updateGlobalCompanyInfo(companyInfo);
        this.dialogRef.close(companyInfo);
      });
    } else {
      this.error = 'Invalid Input*';
    }
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Helper function to update global company information
  private updateGlobalCompanyInfo(companyInfo: any) {
    GlobalComponent.companyName = companyInfo.name;
    GlobalComponent.companyStreet = companyInfo.street;
    GlobalComponent.companyCityTownVillage = companyInfo.city_town_village;
    GlobalComponent.companyCountry = companyInfo.country;
    GlobalComponent.companyPhoneNumber = companyInfo.phoneNumber;
    GlobalComponent.companyTIN = companyInfo.TIN;
  }
  // -------------------------------------------------------------------------------------------------------------
}
