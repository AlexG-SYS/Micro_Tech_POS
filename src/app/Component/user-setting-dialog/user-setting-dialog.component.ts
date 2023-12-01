import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalComponent } from 'src/app/global-component';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user-setting-dialog',
  templateUrl: './user-setting-dialog.component.html',
  styleUrls: ['./user-setting-dialog.component.css'],
})
export class UserSettingDialogComponent implements OnInit {
  companyname = GlobalComponent.companyName;
  username = GlobalComponent.userName;
  userForm!: FormGroup;
  error = '';
  clicked = false;
  isLoading = false;

  // -------------------------------------------------------------------------------------------------------------
  constructor(
    private dialogRef: MatDialogRef<UserSettingDialogComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    // Initialize the userForm with default values and validators
    this.userForm = this.formBuilder.group({
      username: [this.username, Validators.required],
      currentPass: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  ngOnInit(): void { }
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
    if (this.userForm.valid) {
      const userCredentials = this.userForm.value;
      const { currentPass } = userCredentials;

      // Fetch user data to verify the current password
      this.userService
        .getUserCredentials(this.username)
        .subscribe((userData) => {
          const storedPassword = userData[0].password;

          if (storedPassword === currentPass) {
            // Remove currentPass property before updating
            delete userCredentials.currentPass;
            userCredentials.username = userCredentials.username.toLowerCase();

            // Update user credentials
            this.userService
              .updateUserCredentials(userData[0].id, userCredentials)
              .subscribe(() => {
                this.dialogRef.close(userCredentials);
              });
          } else {
            this.error = 'Current password mismatch';
            this.clicked = false;
            this.isLoading = false;
          }
        });
    } else {
      this.error = 'Invalid Input*';
      this.clicked = false;
      this.isLoading = false;
    }
  }
  // -------------------------------------------------------------------------------------------------------------
}
