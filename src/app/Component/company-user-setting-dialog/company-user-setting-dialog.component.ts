import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalComponent } from 'src/app/global-component';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-company-user-setting-dialog',
  templateUrl: './company-user-setting-dialog.component.html',
  styleUrls: ['./company-user-setting-dialog.component.css']
})
export class CompanyUserSettingDialogComponent implements OnInit {

  companyname = GlobalComponent.companyName
  username = GlobalComponent.userName
  companyUserForm!: FormGroup;
  allUserCred: any[] = [];
  error = "";

  constructor(private dialogRef: MatDialogRef<CompanyUserSettingDialogComponent>, private formB: FormBuilder, private userService: UserService) { 
    this.companyUserForm = this.formB.group({
      userID: [, Validators.required],
      username: [, Validators.required],
      password: [, Validators.required],
      privilege: [, Validators.required],
    })
  }

  ngOnInit(): void {
    this.userService.getAllUserCredentials().subscribe(userData => {
      userData.forEach( user => {
        this.allUserCred.push(user)
      })
    });
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
    if (this.companyUserForm.valid) {
      const userCredentials = this.companyUserForm.value;
      const userID = userCredentials.userID;
      delete userCredentials.userID;
      userCredentials.username = userCredentials.username.toLowerCase();

      this.userService.updateUserCredentials(userID, userCredentials).subscribe(() => {
        this.dialogRef.close(userCredentials);
      })
      
    }
    else {
      this.error = "Empty Field"
    }
  }
  // -----------------------------------------------------------------------------------------------------------

}
