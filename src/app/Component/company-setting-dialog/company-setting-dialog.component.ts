import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalComponent } from 'src/app/global-component';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-company-setting-dialog',
  templateUrl: './company-setting-dialog.component.html',
  styleUrls: ['./company-setting-dialog.component.css']
})
export class CompanySettingDialogComponent implements OnInit {

  companyInfoForm!: FormGroup;
  error: string = '';

  constructor(private dialogRef: MatDialogRef<CompanySettingDialogComponent>, private formB: FormBuilder, private userService: UserService) { 
    this.companyInfoForm = this.formB.group({
      name: [GlobalComponent.companyName, Validators.required],
      street: [GlobalComponent.companyStreet, Validators.required],
      city_town_village: [GlobalComponent.companyCityTownVillage, Validators.required],
      country: [GlobalComponent.companyCountry, Validators.required],
      phoneNumber: [GlobalComponent.companyPhoneNumber, Validators.required],
      TIN: [GlobalComponent.companyTIN, Validators.required],
    })
  }
  ngOnInit(): void {
  }

    // -----------------------------------------------------------------------------------------------------------
  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Validates user input, then updates the user on the databse and closes the dialog
  save() {
    if (this.companyInfoForm.valid) {
      const companyInfo = this.companyInfoForm.value;

      this.userService.updateCompanyInfo(companyInfo).subscribe(() => {
        GlobalComponent.companyName = companyInfo.name;
        GlobalComponent.companyStreet = companyInfo.street;
        GlobalComponent.companyCityTownVillage = companyInfo.city_town_village
        GlobalComponent.companyCountry = companyInfo.country;
        GlobalComponent.companyPhoneNumber = companyInfo.phoneNumber;
        GlobalComponent.companyTIN = companyInfo.TIN;

        this.dialogRef.close(companyInfo);
      })
      
    }
    else {
      this.error = "Empty Field"
    }
  }
  // -----------------------------------------------------------------------------------------------------------

}
