import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalComponent } from 'src/app/global-component';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user-setting-dialog',
  templateUrl: './user-setting-dialog.component.html',
  styleUrls: ['./user-setting-dialog.component.css']
})
export class UserSettingDialogComponent implements OnInit {

  companyname = GlobalComponent.companyName
  username = GlobalComponent.userName
  userForm!: FormGroup;
  error = "";

  constructor(private dialogRef: MatDialogRef<UserSettingDialogComponent>, private formB: FormBuilder, private userService: UserService) {
    this.userForm = this.formB.group({
      username: [this.username, Validators.required],
      currentPass: [, Validators.required],
      password: [, Validators.required],
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
    if (this.userForm.valid) {
      const userCredentials = this.userForm.value;
      this.userService.getUserCredentials(this.username).subscribe(userData => {
        if (userData[0].password == userCredentials.currentPass) {
          delete userCredentials.currentPass;
          userCredentials.username = userCredentials.username.toLowerCase();
          
          this.userService.updateUserCredentials(userData[0].id, userCredentials).subscribe(() => {
            this.dialogRef.close(userCredentials);
          });
        }
        else {
          this.error = "Current password mismatch"
        }
      })
    }
    else {
      this.error = "Empty Field"
    }
  }
  // -----------------------------------------------------------------------------------------------------------
}
