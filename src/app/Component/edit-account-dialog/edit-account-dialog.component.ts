import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account } from 'src/app/Data-Model/account';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-edit-account-dialog',
  templateUrl: './edit-account-dialog.component.html',
  styleUrls: ['./edit-account-dialog.component.css'],
})
export class EditAccountDialogComponent implements OnInit {
  // Form group to hold user credentials
  accountForm!: FormGroup;
  account!: Account;

  // -----------------------------------------------------------------------------------------------------------
  constructor(
    private dialogRef: MatDialogRef<EditAccountDialogComponent>,
    private formB: FormBuilder,
    @Inject(MAT_DIALOG_DATA) account: Account,
    private accountService: AccountService
  ) {
    this.account = account;
    this.accountForm = this.formB.group({
      fullName: [account.fullName, Validators.required],
      status: [account.status, Validators.required],
      phone: [account.phone, Validators.required],
      email: [account.email],
      street: [account.street, Validators.required],
      city_town_village: [account.city_town_village, Validators.required],
      country: [account.country],
    });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  ngOnInit(): void {}
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Executes when the save button is clicked. Calles the Account Update Funciton
  save() {
    if (this.accountForm.valid) {
      const accountChanges = this.accountForm.value;

      this.accountService
        .updateAccount(this.account.id, accountChanges)
        .subscribe(() => {
          this.dialogRef.close(accountChanges);
        });
    }
  }
  // -----------------------------------------------------------------------------------------------------------
}
