import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs';
import { Account } from 'src/app/Data-Model/account';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-add-account-form-component',
  templateUrl: './add-account-form-component.component.html',
  styleUrls: ['./add-account-form-component.component.css'],
})
export class AddAccountFormComponentComponent {
  @Output() refreshActiveAccountListEvent: EventEmitter<boolean> =
    new EventEmitter();
  @ViewChild('fullNameInput') searchField!: ElementRef;

  error = '';
  selectedFile: any = null;
  clicked = false;

  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private changeDet: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.searchField.nativeElement.focus();
    this.changeDet.detectChanges();
  }

  // -----------------------------------------------------------------------------------------------------------
  // Grabs the data from the form and saves it to the database
  onNewAccountSubmit(formData: NgForm) {
    this.clicked = true;
    if (formData.valid) {
      const date = new Date().toLocaleDateString();
      const newAccount = { ...formData.value } as Account;

      newAccount.date = date;
      newAccount.balance = 0;

      this.accountService
        .addAccount(newAccount)
        .pipe(
          tap((item) => {
            console.log('Account Successfully Added! ID:', item.id);
            this.resetInput();
            formData.resetForm();
            this.refreshActiveAccountListEvent.emit(true);
            this.openSnackBar('Account Successfully Added!', 'success-snakBar');
          }),
          catchError((error) => {
            this.openSnackBar(
              'An Error Occured While Saving!',
              'error-snakBar'
            );
            throw catchError(error);
          })
        )
        .subscribe();

      formData.resetForm();
      this.resetInput();
      this.clicked = false;
    } else {
      this.error = 'Invalid Input*';
      this.clicked = false;
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Resets Form
  resetInput() {
    this.selectedFile = null;
    this.error = '';
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  //Displays message to the user
  openSnackBar(message: string, cssStyle: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: [cssStyle],
    });
  }
  // -----------------------------------------------------------------------------------------------------------
}
