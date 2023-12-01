import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalComponent } from 'src/app/global-component';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-company-user-setting-dialog',
  templateUrl: './company-user-setting-dialog.component.html',
  styleUrls: ['./company-user-setting-dialog.component.css'],
})
export class CompanyUserSettingDialogComponent implements OnInit {
  // Initial values from GlobalComponent
  companyname = GlobalComponent.companyName;
  username = GlobalComponent.userName;

  // Form group to hold user credentials
  companyUserForm!: FormGroup;
  allUserCred: any[] = [];
  error = '';
  clicked = false;
  isLoading = false;

  // -------------------------------------------------------------------------------------------------------------
  constructor(
    private dialogRef: MatDialogRef<CompanyUserSettingDialogComponent>,
    private formB: FormBuilder,
    private userService: UserService
  ) {
    // Initialize the companyUserForm with default values and validation rules
    this.companyUserForm = this.formB.group({
      userID: [, Validators.required],
      username: [, Validators.required],
      password: [, Validators.required],
      privilege: [, Validators.required],
      discountLimit: [
        ,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(100),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    // Fetch all user credentials on initialization
    this.userService.getAllUserCredentials().subscribe((userData) => {
      this.allUserCred = userData;
    });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Validates user input, updates user credentials, and closes the dialog
  save() {
    this.clicked = true;
    this.isLoading = true;
    if (this.companyUserForm.valid) {
      const userCredentials = this.companyUserForm.value;
      const userID = userCredentials.userID;
      delete userCredentials.userID;
      userCredentials.username = userCredentials.username.toLowerCase();
      userCredentials.discountLimit = +userCredentials.discountLimit;

      // Update user credentials through the UserService
      this.userService
        .updateUserCredentials(userID, userCredentials)
        .subscribe(() => {
          this.dialogRef.close(userCredentials);
        });
    } else {
      this.error = 'Invalid Input*';
      this.clicked = false;
      this.isLoading = false;
    }
  }
  // -------------------------------------------------------------------------------------------------------------
}
